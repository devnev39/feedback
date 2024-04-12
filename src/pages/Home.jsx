import React from 'react'
import {useSelector} from 'react-redux';
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

export default function Home() {
  const feedbacks = useSelector((state) => state.feedback.feedbacks);

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
