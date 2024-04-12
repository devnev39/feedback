import React, { useContext, useEffect } from 'react'
import feedbackApi from '../api/feedback';
import {useSelector, useDispatch} from 'react-redux';
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
import {AlertContext} from '../context/AlertContext';
import { clearFeedbacks, setFeedbacks } from '../feature/feedback';

export default function Home() {
  const feedbacks = useSelector((state) => state.feedback.feedbacks);
  const dispatch = useDispatch();
  const {showMessage} = useContext(AlertContext);
  useEffect(() => {
    feedbackApi.getFeedbacks().then((resp) => {
      dispatch(clearFeedbacks());
      dispatch(setFeedbacks(resp));
    }).catch((err) => {
      showMessage(err.message, 'error');
    })
  }, []);
  return (
    <>
      <div>
        <MDBCard>
          <MDBCardTitle>
            <div className='d-flex justify-content-center'>
              <MDBTypography className='display-4'>
                Feedbacks
              </MDBTypography>
            </div>
          </MDBCardTitle>
          <MDBCardBody>
            <MDBTypography className='display-6'>
              Total feedbacks received : <MDBTypography tag='mark'>{feedbacks.length}</MDBTypography>
            </MDBTypography>
          </MDBCardBody>
        </MDBCard>
      </div>
    </>
  )
}
