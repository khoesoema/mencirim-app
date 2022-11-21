import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import LogoutIcon from '@mui/icons-material/Logout';
import LocationCityIcon from '@mui/icons-material/LocationCity';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HailIcon from '@mui/icons-material/Hail';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LayersIcon from '@mui/icons-material/Layers';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import Category from '@mui/icons-material/Category';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PublicIcon from '@mui/icons-material/Public';
import DomainIcon from '@mui/icons-material/Domain';
import StoreIcon from '@mui/icons-material/Store';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes } from '@fortawesome/free-solid-svg-icons/faBoxes';
import { faPercent } from '@fortawesome/free-solid-svg-icons/faPercent';

import { FaUserTie } from 'react-icons/fa'
import { GrMoney } from 'react-icons/gr';
import { GiWorld } from 'react-icons/gi';
import { GiPaperBagOpen } from 'react-icons/gi';

import { Icon } from '@rsuite/icons';
import GearIcon from '@rsuite/icons/Gear';

import Form from 'rsuite/Form';

import { PageRoutes } from './Routers';

const drawerWidth = 300;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

const mdTheme = createTheme();

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
    },
  },
});

function DashboardContent() {
  let navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = React.useState('');
  const [dialogContent, setDialogContent] = React.useState('');
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [repeatNewPassword, setRepeatNewPassword] = React.useState('');
  const [changing, setChanging] = React.useState(false);

  const logoutNow = (e) => {
    Meteor.logout();
  };
  const changePassword = (e) => {
    setChanging(true);
    if (newPassword && confirmNewPassword) {
      setChanging(true);
      Meteor.call(
        'system.selfResetPassword',
        {
          userID: _id,
          newPassword,
          confirmNewPassword,
        },
        (err, res) => {
          if (err) {
            setStartChangePassword(false);
            setChanging(false);
            setDialogOpen(true);
            setDialogTitle(err.error);
            setDialogContent(err.reason);
          } else if (res) {
            let resultCode = res.code;
            let resultTitle = res.title;
            let resultMessage = res.message;
            if (resultCode === 200) {
              setStartChangePassword(false);
              setChanging(false);
              setSiteChangePasswordModal(false);
              setNewPassword('');
              setConfirmNewPassword('');
              setChanging(false);
              setDialogOpen(true);
              setDialogTitle('Success');
              setDialogContent('Password Changed.');
            } else {
              setStartChangePassword(false);
              setChanging(false);
              setDialogOpen(true);
              setDialogTitle(resultTitle);
              setDialogContent(resultMessage);
            }
          } else {
            setStartChangePassword(false);
            setChanging(false);
            setDialogOpen(true);
            setDialogTitle('Unexpected Error');
            setDialogContent(
              'Unexpected Error Occured, please contact your customer service'
            );
          }
        }
      );
    } else {
      setStartChangePassword(false);
      setDialogOpen(true);
      setDialogTitle('Validation Failed');
      setDialogContent('Please fill all field');
    }
  };

  const [openDrawer, setOpenDrawer] = React.useState(false);
  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const [openMenu, setOpenMenu] = React.useState(false);
  const [openReports, setOpenReports] = React.useState(false);
  const [openSettings, setOpenSettings] = React.useState(false);
  const [openAcc, setOpenAcc] = React.useState(false);
  const [openTrx, setOpenTrx] = React.useState(false);

  const handleClick = () => {
    setOpenMenu(!openMenu);
  };

  return (
    <>
      <Dialog 
        fullWidth={true}
        maxWidth="md"
        open={changePasswordDialogOpen} 
        onClose={()=> setChangePasswordDialogOpen(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
        <Form
            fluid
            onSubmit={() => {
              changePassword();
            }}
            disabled={changing}
          >
            <Form.Group controlId="currentPassword">
              <Form.ControlLabel>Password Lama</Form.ControlLabel>
              <Form.Control
                type="password"
                name="currentPassword"
                required
                placeholder="Password Lama"
                value={currentPassword}
                onChange={(e) => {
                  setCurrentPassword(e);
                }}
                disabled={changing}
              />
            </Form.Group>
            <Form.Group controlId="newPassword">
              <Form.ControlLabel>Password Baru</Form.ControlLabel>
              <Form.Control
                type="password"
                name="newPassword"
                required
                placeholder="Password Baru"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e);
                }}
                disabled={changing}
              />
            </Form.Group>
            <Form.Group controlId="repeatNewPassword">
              <Form.ControlLabel>
                Konfirmasi Password Baru
              </Form.ControlLabel>
              <Form.Control
                type="password"
                name="repeatNewPassword"
                required
                placeholder="Konfirmasi Password Baru"
                value={repeatNewPassword}
                onChange={(e) => {
                  setRepeatNewPassword(e);
                }}
                disabled={changing}
              />
            </Form.Group>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {setChangePasswordDialogOpen(false);}}>Cancel</Button>
          <Button loading={changing} onClick={() => {changePassword();} }>Change</Button>
        </DialogActions>
      </Dialog>
      <ThemeProvider theme={mdTheme}>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar position="absolute" open={openDrawer} sx={{ backgroundColor: '#121212', color: 'white' }}>
            <Toolbar
              sx={{
                pr: '24px', // keep right padding when drawer closed
              }}
            >
              <IconButton
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  marginRight: '36px',
                  ...(openDrawer && { display: 'none' }),
                }}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }}>
                <Button sx={{ color: "#00e5ff" }} onClick={() => navigate('/')} >
                  Mantap Agung Sejati
                </Button>
              </Box>
              <div>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <MenuItem onClick={handleClose}>Profile</MenuItem>
                  <MenuItem onClick={() => { setChangePasswordDialogOpen(true); }}>Change Password</MenuItem>
                </Menu>
              </div>
              <Button color="inherit" endIcon={<LogoutIcon />} onClick={(e) => { logoutNow(e); }}>Sign Out</Button>
            </Toolbar>
          </AppBar>
          <Drawer variant="permanent" open={openDrawer}>
            <Toolbar
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                px: [1],
                backgroundColor: '#121212',
                color: 'white'
              }}
            >
              <IconButton onClick={toggleDrawer} color="inherit">
                <ChevronLeftIcon />
              </IconButton>
            </Toolbar>
            <Divider />
            <List
              component="nav">

              <ListItemButton onClick={() => navigate('/')}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>

              <ListItemButton onClick={() => navigate('/CashierOnBoarding')}>
                <ListItemIcon>
                  <PointOfSaleIcon />
                </ListItemIcon>
                <ListItemText primary="Cashier" />
              </ListItemButton>

              <ListItemButton onClick={() => navigate('/Products')}>
                <ListItemIcon>
                  <FontAwesomeIcon icon={faBoxes} />
                </ListItemIcon>
                <ListItemText primary="Products" />
              </ListItemButton>

              <ListItemButton onClick={() => navigate('/Customers')}>
                <ListItemIcon>
                  <HailIcon />
                </ListItemIcon>
                <ListItemText primary="Customers" />
              </ListItemButton>

              <ListItemButton onClick={() => navigate('/Supplier')}>
                <ListItemIcon>
                  <Icon as={FaUserTie} />
                </ListItemIcon>
                <ListItemText primary="Supplier" />
              </ListItemButton>

              <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                  <LayersIcon />
                </ListItemIcon>
                <ListItemText primary="Data" />
                {openMenu ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openMenu} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/Categories')}>
                    <ListItemIcon>
                      <Category />
                    </ListItemIcon>
                    <ListItemText primary="Kategori" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} divider onClick={() => navigate('/UOM')}>
                    <ListItemIcon>
                      <Icon as={GiPaperBagOpen} />
                    </ListItemIcon>
                    <ListItemText primary="Satuan" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} divider onClick={() => navigate('/BusinessTypes')}>
                    <ListItemIcon>
                      <DomainIcon />
                    </ListItemIcon>
                    <ListItemText primary="Tipe Bisnis" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/Negara')}>
                    <ListItemIcon>
                      <Icon as={GiWorld} />
                    </ListItemIcon>
                    <ListItemText primary="Negara" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/Provinsi')}>
                    <ListItemIcon>
                      <PublicIcon />
                    </ListItemIcon>
                    <ListItemText primary="Provinsi" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} divider onClick={() => navigate('/Kota')}>
                    <ListItemIcon>
                      <LocationCityIcon />
                    </ListItemIcon>
                    <ListItemText primary="Kota" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/Kassa')}>
                    <ListItemIcon>
                      <PointOfSaleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Kassa" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/Currencies')}>
                    <ListItemIcon>
                      <MonetizationOnIcon />
                    </ListItemIcon>
                    <ListItemText primary="Mata Uang" />
                  </ListItemButton>

                </List>
              </Collapse>

              <ListItemButton onClick={() => { setOpenTrx(!openTrx); }}>
                <ListItemIcon>
                  <StoreIcon />
                </ListItemIcon>
                <ListItemText primary="Transactions" />
                {openTrx ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openTrx} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/PurchaseOrder')}>
                    <ListItemIcon>
                      <AddShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Order Pembelian" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/PurchaseInvoices')}>
                    <ListItemIcon>
                      <ShoppingCartCheckoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Pembelian Barang" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} divider onClick={() => navigate('/PurchaseRetur')}>
                    <ListItemIcon>
                      <RemoveShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Retur Pembelian" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/SalesInvoices')}>
                    <ListItemIcon>
                      <ShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Penjualan" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} divider onClick={() => navigate('/SalesReturInvoices')}>
                    <ListItemIcon>
                      <RemoveShoppingCartIcon />
                    </ListItemIcon>
                    <ListItemText primary="Retur Penjualan" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/Promotions')}>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faPercent} />
                    </ListItemIcon>
                    <ListItemText primary="Promo Barang" />
                  </ListItemButton>

                </List>
              </Collapse>

              <ListItemButton onClick={() => { setOpenReports(!openReports); }}>
                <ListItemIcon>
                  <BarChartIcon />
                </ListItemIcon>
                <ListItemText primary="Reports" />
                {openReports ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openReports} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/LaporanStok')}>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Laporan Stok" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/LaporanPembelian')}>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Laporan Pembelian" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/LaporanPenjualan')}>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Laporan Penjualan" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/LaporanPenjualanDetail')}>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Laporan Penjualan Detail" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/LaporanBulanan')}>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Laporan Bulanan" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={() => navigate('/LaporanTahunan')}>
                    <ListItemIcon>
                      <AssignmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Laporan Tahunan" />
                  </ListItemButton>

                </List>
              </Collapse>

              <Divider sx={{ my: 1 }} />
              <ListItemButton onClick={() => { setOpenAcc(!openAcc); }}>
                <ListItemIcon>
                  <LibraryBooksIcon />
                </ListItemIcon>
                <ListItemText primary="Accounting" />
                {openAcc ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openAcc} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>

                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <HailIcon />
                    </ListItemIcon>
                    <ListItemText primary="Customers & Penjualan" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <Icon as={FaUserTie} />
                    </ListItemIcon>
                    <ListItemText primary="Supplier & Pembelian" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <FontAwesomeIcon icon={faBoxes} />
                    </ListItemIcon>
                    <ListItemText primary="Persediaan" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon>
                      <Icon as={GrMoney} />
                    </ListItemIcon>
                    <ListItemText primary="Kas Bank" />
                  </ListItemButton>
                </List>
              </Collapse>

              <Divider sx={{ my: 1 }} />

              <ListItemButton onClick={() => { setOpenSettings(!openSettings); }}>
                <ListItemIcon>
                  <Icon as={GearIcon} spin />
                </ListItemIcon>
                <ListItemText primary="Settings" />
                {openSettings ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={openSettings} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>

                  <ListItemButton sx={{ pl: 4 }} onClick={(e) => navigate('/Users')}>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText primary="Users" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={(e) => navigate('/UserRole')}>
                    <ListItemIcon>
                      <ManageAccountsIcon />
                    </ListItemIcon>
                    <ListItemText primary="User Role" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={(e) => navigate('/UserLog')}>
                    <ListItemIcon>
                      <CheckCircleIcon />
                    </ListItemIcon>
                    <ListItemText primary="User Log" />
                  </ListItemButton>

                  <ListItemButton sx={{ pl: 4 }} onClick={(e) => navigate('/ErrorLog')}>
                    <ListItemIcon>
                      <ReportProblemIcon />
                    </ListItemIcon>
                    <ListItemText primary="User Error Log" />
                  </ListItemButton>

                </List>
              </Collapse>

            </List>
          </Drawer>
          <Box
            component="main"
            sx={{
              backgroundColor: (theme) =>
                theme.palette.mode === 'light'
                  ? theme.palette.grey[100]
                  : theme.palette.grey[900],
              flexGrow: 1,
              height: '100vh',
              overflow: 'auto',
            }}
          >
            <Toolbar />
            <Container fixed sx={{ mt: 2, mb: 2 }}>
              <PageRoutes />
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    </>
  );
}

export function HomePage() {
  return <DashboardContent />;
}