import React, { useContext, useEffect, useState } from 'react'
import projectApi from '../api/project';
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
    MDBInput,
    MDBIcon
  } from 'mdb-react-ui-kit';
import {useSelector, useDispatch} from 'react-redux';
import { clearProjects, removeProject, setProjects, updateProject } from '../feature/project';
import { AlertContext } from '../context/AlertContext';
import dayjs from 'dayjs';
import { Formik } from 'formik';


export default function IAM() {
    const [basicModal, setBasicModal] = useState(false);

    const user = useSelector((state) => state.user.user);

    const [projectState, setProjectState] = useState({
        name: "",
        links: [],
        questions: []
    })

    const [projectUpdating, setProjectUpdating] = useState(false);
    const [render, setRender] = useState(false);
    const resetProjectState = () => {
        setProjectState({
            name: "",
            links: [],
            questions: [],
            extra: ""
        })
        setProjectUpdating(false);
    }

    const toggleOpen = () => setBasicModal(!basicModal);

    const [fillActive, setFillActive] = useState('tab1');
    const handleFillClick = (value) => {
        if (value === fillActive) {
            return;
        }
        setFillActive(value);
    };

    const {showMessage} = useContext(AlertContext);
    const dispatch = useDispatch();
    const projects = useSelector((state) => state.project.projects);

    useEffect(() => {
        projectApi.getProjects().then((resp) => {
            dispatch(clearProjects());
            dispatch(setProjects(resp));
        }).catch((err) => {
            showMessage(err.message, 'error');
        });

        () => {
            dispatch(clearProjects());
        }
    }, []);

    const updateProjectClicked = (p) => {
        setProjectUpdating(true);
        setProjectState(JSON.parse(JSON.stringify(p)));
        toggleOpen();
    }

    const addUpdateProject = (values, setSubmitting) => {
        if (projectUpdating) {
            delete values.extra;
            for (let q of values.questions) {
                q.options = q.options.split(',');
            }
            projectApi.updateProject(values).then((resp) => {
                dispatch(updateProject(resp));
                showMessage("Project updated !");
                resetProjectState();
                toggleOpen();
            }).catch((err) => {
                showMessage(err.message, 'error');
            }).finally(() => setSubmitting(false));
        } else {
            values.createdAt = dayjs().toISOString();
            for (let q of values.questions) {
                q.options = q.options.split(',');
            }
            delete values.extra;
            projectApi.createProject(values).then((resp) => {
                dispatch(setProjects(resp));
                showMessage('Project created !');
                resetProjectState();
                toggleOpen();
            }).catch((err) => {
                showMessage(err.message, 'error');
            }).finally(() => setSubmitting(false));
        }
    }

    const deleteProject = (p) => {
        if (!window.confirm('Confirm to delete the project permenantly ?')) return;
        projectApi.deleteProject(p.id).then(() => {
            dispatch(removeProject(p));
            showMessage('Project deleted !');
        }).catch((err) => {
            showMessage(err.message, 'error');
        })
    }

    return (
        <>
        {
            user && user.rootUser ? 
            <>
            <MDBTabs fill className='mb-3'>
                <MDBTabsItem>
                    <MDBTabsLink onClick={() => handleFillClick('tab1')} active={fillActive === 'tab1'}>
                        Projects
                    </MDBTabsLink>
                </MDBTabsItem>
            </MDBTabs>
            <MDBTabsContent>
                <MDBTabsPane open={fillActive === 'tab1'}>
                    <MDBCard>
                        <MDBCardBody>
                            <div className='d-flex justify-content-center'>
                                <MDBTypography className='display-6'>Projects</MDBTypography>
                            </div>
                            <div className='d-flex justify-content-center'>
                                <div className='border rounded'>
                                    <MDBTable striped>
                                        <MDBTableHead>
                                            <tr>
                                                <th scope='col'>#</th>
                                                <th scope='col'>Name</th>
                                                <th scope='col'>Created At</th>
                                                <th scope='col'>Responses</th>
                                                <th scope='col'><div className='text-center'>Actions</div></th>
                                            </tr>
                                        </MDBTableHead>
                                        <MDBTableBody>
                                            {projects.map((p) => (
                                                <tr key={p.id}>
                                                    <td>{projects.findIndex((pr) => pr.id == p.id) + 1}</td>
                                                    <td>{p.name}</td>
                                                    <td>{dayjs(p.createdAt).toDate().toLocaleString()}</td>
                                                    <td></td>
                                                    <td>
                                                        <MDBBtn type='button' color='link' onClick={() => updateProjectClicked(p)} className='text-info'>Edit</MDBBtn>
                                                        <MDBBtn type='button' color='link' onClick={() => deleteProject(p)} className='text-danger'>Delete</MDBBtn>
                                                    </td>
                                                </tr>
                                            ))}
                                        </MDBTableBody>
                                    </MDBTable>
                                </div>
                            </div>
                            <div className='d-flex justify-content-center my-3'>
                                <MDBBtn onClick={toggleOpen}>Add</MDBBtn>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBTabsPane>
            </MDBTabsContent>
            <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex='-1'>
                <MDBModalDialog>
                    <MDBModalContent>
                        <MDBModalHeader>
                            <MDBModalTitle>Add Project</MDBModalTitle>
                            <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
                        </MDBModalHeader>
                    <MDBModalBody>
                        <Formik
                        initialValues={projectState}
                        enableReinitialize
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            links: Yup.array().of(Yup.object()),
                            questions: Yup.array().of(Yup.object().shape({
                                text: Yup.string(),
                                options: Yup.string(),
                                selected: Yup.number()
                            }))
                        })}
                        onSubmit={(values, {setSubmitting}) => addUpdateProject(values, setSubmitting)}
                        >
                            {
                            (formik) => (
                                <form id='projectForm' onSubmit={formik.handleSubmit}>
                                    <div className='my-2'>
                                        <MDBInput label='Name' {...formik.getFieldProps('name')} />
                                        {formik.touched.name && formik.errors.name ? 
                                        <MDBTypography note noteColor='danger'>
                                            {formik.errors.name}
                                        </MDBTypography> : null }
                                    </div>
                                    <div className='my-2'>
                                        <MDBTypography className='mark'>
                                            Add Links
                                        </MDBTypography>
                                        {
                                            formik.values.links.map((l, i) => (
                                                <div key={i} className='d-flex justify-content-evenly my-2'>
                                                    <MDBInput label='Type' {...formik.getFieldProps(`links[${i}].type`)}/>
                                                    <MDBInput label='Link' {...formik.getFieldProps(`links[${i}].link`)}/>
                                                    <MDBBtn type='button' color='link' className='text-danger' onClick={() => {
                                                        formik.values.links.splice(i, 1);
                                                        setRender(!render);
                                                    }}><MDBIcon fas icon="trash" /></MDBBtn>
                                                </div>
                                            ))
                                        }
                                        <MDBBtn type='button' color='link' onClick={() => {
                                            formik.values.links.push({
                                                type: "",link :""
                                            });
                                            setRender(!render);
                                        }}><MDBIcon fas icon="plus" /></MDBBtn>
                                    </div>
                                    <div className='my-2'>
                                        <MDBTypography className='mark'>
                                            Add Questions
                                        </MDBTypography>
                                        {
                                            formik.values.questions.map((q,i) => (
                                                <div key={i} className='d-flex justify-content-evenly my-2'>
                                                    <MDBInput id={q.text} label='Text' {...formik.getFieldProps(`questions[${i}].text`)}/>
                                                    <MDBInput id={q.options} label='Options' {...formik.getFieldProps(`questions[${i}].options`)}/>
                                                    <MDBBtn type='button' color='link' className='text-danger' onClick={() => {
                                                        formik.values.questions.splice(i, 1);
                                                        setRender(!render);
                                                    }}><MDBIcon fas icon="trash" /></MDBBtn>
                                                </div>
                                            ))
                                        }
                                        <MDBBtn type='button' color='link' onClick={() => {
                                            formik.values.questions.push({
                                                text: "", options: ""
                                            });
                                            setRender(!render);
                                        }}><MDBIcon fas icon="plus" /></MDBBtn>
                                    </div>
                                </form>
                            )
                            }
                        </Formik>
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color='secondary' onClick={() => {
                            resetProjectState();
                            toggleOpen();
                        }}>
                            Close
                        </MDBBtn>
                        <MDBBtn type='submit' form='projectForm'>{projectUpdating ? 'Update' : 'Save'}</MDBBtn>
                    </MDBModalFooter>
                    </MDBModalContent>
                </MDBModalDialog>
            </MDBModal>
            </>:
            <>
                <div className='d-flex justify-content-center align-items-center w-100' style={{height: "80vh"}}>
                    <MDBTypography className='mark'>
                        Not authorised !
                    </MDBTypography>
                </div>
            </>
        }
        </>
    )
}
