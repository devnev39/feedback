import React, { useContext, useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux';
import * as Yup from 'yup';
import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane,
  MDBTable,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBTypography,
  MDBTableHead,
  MDBTableBody,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBRadio,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';
import Rating from 'react-rating';
import projectApi from '../api/project';
import feedbackApi from '../api/feedback';
import Select from 'react-select'
import { AlertContext } from '../context/AlertContext';
import dayjs from 'dayjs';
import { Formik } from 'formik';
import { clearProjects, setProjects } from '../feature/project';
import { clearFeedbacks, removeFeedback, setFeedbacks, updateFeedback } from '../feature/feedback';

export default function Feedback() {
  const projects = useSelector((state) => state.project.projects);
  const feedbacks = useSelector((state) => state.feedback.feedbacks);
  const user = useSelector((state) => state.user.user);

  const [widht, setWidth] = useState(window.innerWidth);

  const {showMessage} = useContext(AlertContext);

  const dispatch = useDispatch();
  useEffect(() => {
    projectApi.getProjects().then((resp) => {
      dispatch(clearProjects());
      dispatch(setProjects(resp));
    }).catch((err) => {
      showMessage(err.message, 'error');
    })

    feedbackApi.getFeedbacks().then((resp) => {
      dispatch(clearFeedbacks());
      dispatch(setFeedbacks(resp));
    }).catch((err) => {
      showMessage(err.message, 'error');
    })

    return () => {
      dispatch(clearProjects());
    }
  }, [])

  const [feedbackUpdating, setFeedbackUpdating] = useState(false);
  const [selectedProject, setSelectedProject] = useState({
    name: "",
    questions: [],
    links: [],
    rating: 0
  });

  const [feedbackUser, setFeedbackUser] = useState(null);
  const [feedbackView, setFeedbackView] = useState(false);

  const [feedbackId, setFeedbackId] = useState(null);

  const [basicModal, setBasicModal] = useState(false);
  const toggleOpen = () => setBasicModal(!basicModal);

  const updateFeedbackClicked = (feedback) => {
    setFeedbackUpdating(true);
    setSelectedProject(JSON.parse(JSON.stringify(feedback.project)));
    setFeedbackId(feedback.id);
    toggleOpen();
  }

  const resetFeedbackState = () => {
    setSelectedProject({
      name: "",
      questions: [],
      links: [],
      rating: 0,
      extra: ""
    });
    setFeedbackUpdating(false);
    setFeedbackId(null);
  }

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);


  const addUpdateFeedback = (values, setSubmitting) => {
    console.log(values);
    if (!values.rating) {
      showMessage('Please leave some rating !', 'info');
      return;
    }

    for (const q of values.questions) {
      if (q.selected == undefined || q.selected == -1) {
        showMessage(`Please select your option for - ${q.text} !`, 'info');
        return;
      }
    }

    const feedback = {id: feedbackId};
    feedback.project = values;

    if (feedbackUpdating) {
      console.log(feedback);
      feedbackApi.updateFeedback(feedback).then((resp) => {
        dispatch(updateFeedback(resp));
        showMessage('Feedback updated !');
        toggleOpen();
        resetFeedbackState();
      }).catch((err) => {
        console.log(err);
        showMessage(err.message, 'error');
      })
    } else {
      feedback.user = user;
      feedback.createdAt = dayjs().toISOString();
      feedbackApi.createFeedback(feedback).then((resp) => {
        dispatch(setFeedbacks(resp));
        showMessage('Feedback saved !');
        toggleOpen();
        resetFeedbackState();
      }).catch((err) => {
        console.log(err);
        showMessage(err.message, 'error');
      })
    }
  }

  const viewFeedback = (feedback) => {
    setSelectedProject(feedback.project);
    setFeedbackUser(feedback.user);
    setFeedbackView(true);
    toggleOpen();
  }

  const resetViewFeedback = () => {
    resetFeedbackState();
    setFeedbackUser(null);
    setFeedbackView(false);
  }

  const deleteFeedback = (feedback) => {
    if (!window.confirm('Confirm to delete the feedback ?')) return;
    feedbackApi.deleteFeedback(feedback.id).then(() => {
      dispatch(removeFeedback(feedback));
      showMessage('Feedback deleted !');
    }).catch((err) => {
      showMessage(err.message, 'error');
    })
  }

  return (
    <>
    {
      Object.keys(user).length ? 
      <>
        <div className='d-flex justify-content-center mt-3'>
          <MDBCard className='p-3'>
            <MDBCardTitle>
              <div className='d-flex justify-content-center'>
                <MDBTypography className='display-6'>
                  Feedbacks
                </MDBTypography>
              </div>
            </MDBCardTitle>
            <MDBCardBody>
              <div className='border rounded overflow-auto' style={{maxHeight: "60vh"}}>
                <MDBTable striped small={widht < 500 ? true : false}>
                  <MDBTableHead>
                    <tr>
                      <th scope='col'>#</th>
                      <th scope='col'>User</th>
                      <th scope='col'>Project</th>
                      <th scope='col'>Rating</th>
                      <th scope='col'><div className='text-center'>Actions</div></th>
                    </tr>
                  </MDBTableHead>
                  <MDBTableBody>
                    {
                      feedbacks.filter((f) => f.user.email == user.email).map((f) => (
                        <tr key={f.id}>
                          <td>{feedbacks.findIndex((fb) => fb.id == f.id) + 1}</td>
                          <td>{f.user.displayName}</td>
                          <td>{f.project.name}</td>
                          <td><Rating initialRating={f.project.rating} readonly emptySymbol={<MDBIcon className='text-danger' far icon="star" />} fullSymbol={<MDBIcon className='text-info' fas icon="star" />} /></td>
                          <td>
                            <MDBBtn size='sm' color='link' className='text-warning' onClick={() => updateFeedbackClicked(f)}><MDBIcon fas icon="pencil-alt" /></MDBBtn>
                            <MDBBtn size='sm' color='link' className='text-danger' onClick={() => deleteFeedback(f)} disabled={!user.rootUser}><MDBIcon fas icon="trash" /></MDBBtn>
                          </td>
                        </tr>
                      ))
                    }
                    {
                      feedbacks.filter((f) => f.user.email != user.email).map((f) => (
                        <tr key={f.id}>
                          <td>{feedbacks.findIndex((fb) => fb.id == f.id) + 1}</td>
                          <td>{f.user.displayName}</td>
                          <td>{f.project.name}</td>
                          <td><Rating initialRating={f.project.rating} readonly emptySymbol={<MDBIcon className='text-danger' far icon="star" />} fullSymbol={<MDBIcon className='text-info' fas icon="star" />} /></td>
                          <td>
                            {
                              user.rootUser ?
                              <>
                              <MDBBtn size='sm' color='link' className='text-warning' onClick={() => updateFeedbackClicked(f)}><MDBIcon fas icon="pencil-alt" /></MDBBtn>
                              <MDBBtn size='sm' color='link' className='text-danger' onClick={() => deleteFeedback(f)} disabled={!user.rootUser}><MDBIcon fas icon="trash" /></MDBBtn> 
                              </>
                              :
                              <MDBBtn color='link' className='text-info' onClick={() => viewFeedback(f)}>
                                <MDBIcon fas icon="eye" />
                              </MDBBtn>
                            }
                            
                          </td>
                        </tr>
                      ))
                    }
                  </MDBTableBody>
                </MDBTable>
                </div>
              <div className='d-flex justify-content-center mt-3'>
                <MDBBtn onClick={() => {
                  resetFeedbackState();
                  toggleOpen();
                }}>Sumbit Feedback</MDBBtn>
              </div>
            </MDBCardBody>
          </MDBCard>
        </div>
        <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex='-1'>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                  <MDBModalTitle>
                    {feedbackView ? `Feedback by ${feedbackUser.displayName}` : 'Submit Feedback'}
                  </MDBModalTitle>
                  <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
                <div className='my-2'>
                  {feedbackUpdating || feedbackView ? 
                    <MDBTypography className='fs-3'>
                      {selectedProject.name}
                    </MDBTypography>
                  :<Select
                    onChange={(e) => {
                    setSelectedProject(e.value)}
                  } 
                  options={projects.filter((p) => {
                    const userFeedbacks = feedbacks.filter((f) => f.user.email == user.email);
                    if (userFeedbacks.findIndex((uf) => uf.project.id == p.id) == -1) return p;
                  }).map((p) => ({label: p.name, value: p}))} 
                  isSearchable
                  />}
                </div>
                {
                  selectedProject ?
                  <Formik
                  initialValues={JSON.parse(JSON.stringify(selectedProject))}
                  enableReinitialize
                  validationSchema={Yup.object({
                      questions: Yup.array().of(Yup.object().shape({
                        selected: Yup.number()
                      })),
                      rating: Yup.number()
                  })}
                  onSubmit={(values, {setSubmitting}) => addUpdateFeedback(values, setSubmitting)}
                  >
                      {
                      (formik) => (
                          <form id='feedbackForm' onSubmit={formik.handleSubmit}>
                            <div>
                              <MDBTypography listInLine>
                                <li className='list-inline-item'>
                                  <MDBTypography className='mark'>Links :</MDBTypography>
                                </li>
                                {selectedProject.links.map((l,i) => (
                                  <li key={i} className='mx-2 list-inline-item'>
                                    <MDBBtn type='button' color='link' className='text-primary' onClick={() => window.open(l.link)}>{l.type}</MDBBtn>
                                  </li>
                                ))}
                              </MDBTypography>
                            </div>
                            <div>
                              <MDBTypography className='mark'>
                                Questions
                              </MDBTypography>
                              <div>
                                {
                                  formik.values.questions.map((q,i) => (
                                    <div key={i}>
                                      <MDBTypography>
                                        {q.text}
                                      </MDBTypography>
                                      <div className='d-flex justify-content-equal'>
                                        {
                                          q.options.map((o, j) => (
                                            <MDBRadio disabled={feedbackView} defaultChecked={(feedbackUpdating || feedbackView) && formik.values.questions.length && formik.values.questions[i].selected == j} key={o} name={`radio-${i}`} value={j} label={o} inline onChange={(e) => {
                                              if (e.target.checked) {
                                                formik.setFieldValue(`questions[${i}].selected`, j);
                                              }
                                            }} />
                                          ))
                                        }
                                      </div>
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                            <hr className='hr'/>
                            <div className='d-flex justify-content-evenly align-items-center'>
                              <MDBTypography className='fs-5'>
                                Overal Rating :
                              </MDBTypography>
                              <MDBTypography className='fs-5'>
                                <Rating readonly={feedbackView} initialRating={formik.values.rating} onChange={(value) => {
                                  formik.setFieldValue('rating', value)
                                }} emptySymbol={<MDBIcon className='text-danger' far icon="star" />} fullSymbol={<MDBIcon className='text-info' fas icon="star" />} />
                              </MDBTypography>
                            </div>
                          </form>
                      )
                      }
                  </Formik> : null
                } 
              </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn color='secondary' onClick={() => {
                  if (feedbackView) resetViewFeedback();
                  else resetFeedbackState();
                  toggleOpen();
                }}>
                    Close
                </MDBBtn>
                <MDBBtn type='submit' form='feedbackForm' disabled={feedbackView}>{feedbackUpdating ? 'Update' : 'Save'}</MDBBtn>
            </MDBModalFooter>
            </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      </> :
      <>
        <div className='d-flex justify-content-center align-items-center' style={{height: "80vh"}}>
          <MDBTypography className='mark'>
          Need to login to submit a feedback !
          </MDBTypography>          
        </div>
      </>
    }
    </>
  )
}
