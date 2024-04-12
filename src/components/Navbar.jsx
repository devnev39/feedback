import { useContext, useState } from 'react';
import {
  MDBNavbar,
  MDBContainer,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBCollapse,
  MDBBtn,
  MDBNavbarNav,
  MDBIcon,
  MDBTypography
} from 'mdb-react-ui-kit';
import { UserContext } from '../context/UserContext';
import {useSelector} from 'react-redux';

export default function Navbar() {
  const [openNavNoTogglerThird, setOpenNavNoTogglerThird] = useState(false);
  const {googleSignIn, logout} = useContext(UserContext);
  const user = useSelector((state) => state.user.user);
  return (
    <>
      <MDBNavbar expand='lg' light bgColor='light'>
        <MDBContainer className='d-flex justify-content-between'>
          <MDBNavbarToggler
            type='button'
            data-target='#navbarTogglerDemo03'
            aria-controls='navbarTogglerDemo03'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={() => setOpenNavNoTogglerThird(!openNavNoTogglerThird)}
          >
            <MDBIcon icon='bars' fas />
          </MDBNavbarToggler>
          <MDBNavbarBrand className='d-flex align-items-center'>
                <MDBTypography className='fs-3'>
                    Feeback
                </MDBTypography>
            </MDBNavbarBrand>
          <MDBCollapse className='me-5 fs-5' navbar open={openNavNoTogglerThird}>
            <MDBNavbarNav right fullWidth={false} className='mr-5'>
              <MDBNavbarItem>
                <MDBNavbarLink active={window.location.href.endsWith('/')} aria-current='page' href='/'>
                  Home
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink active={window.location.href.endsWith('/feedback')} href='/feedback'>Feedback</MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink active={window.location.href.endsWith('/iam')} href='/iam' tabIndex={-1}>
                  IAM
                </MDBNavbarLink>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBNavbarLink active={window.location.href.endsWith('/about')} href='/about' tabIndex={-1}>
                  About
                </MDBNavbarLink>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
          <MDBBtn onClick={() => Object.keys(user).length ? logout() : googleSignIn()} color='secondary' floating tag={'a'}>
            {Object.keys(user).length ? <img
              src={user.photoUrl}
              className='img-fluid'
              alt={user.displayName}
            />: <MDBIcon color='success' fab icon="google" />}
          </MDBBtn>
        </MDBContainer>
      </MDBNavbar>
    </>
  );
}