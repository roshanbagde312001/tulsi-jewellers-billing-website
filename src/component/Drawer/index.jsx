import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MuiAppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { styled, useTheme } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDrawerContext } from '../drawerContext';

const drawerWidth = 240;

const isOpenededMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    variants: [
      {
        props: ({ open }) => open,
        style: {
          ...isOpenededMixin(theme),
          '& .MuiDrawer-paper': isOpenededMixin(theme),
        },
      },
      {
        props: ({ open }) => !open,
        style: {
          ...closedMixin(theme),
          '& .MuiDrawer-paper': closedMixin(theme),
        },
      },
    ],
  }),
);

export default function MiniDrawer({children}) {
  const theme = useTheme();
  const {open, toggleIsOpened,menu} = useDrawerContext();
  const [listItemSelected,setlistItemSelected]= useState("Generate Bill")
  const navigate = useNavigate()
  //   const handleDrawerisOpened = () => {
//     toggleaIsOpened(!open);
//   };

//   const handleDrawerClose = () => {
//     toggleaIsOpened(!open);
//   };

  function listItemButtonclick(text){
    navigate(text.route)
    setlistItemSelected(text.name)
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} style={{background:"	#551756"}}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleIsOpened}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              open && { display: 'none' },
            ]}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" style={{fontFamily: 'Great Vibes, cursive'}}>
            Tulsi Jewellers
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} 
      sx={{
    '& .MuiDrawer-paper': {
      backgroundColor: '#551756',
      color:"white" // your desired color
    },
  }}>
        <DrawerHeader style={{background:"	#551756"}}>
          <IconButton onClick={toggleIsOpened} style={{color:"white"}}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
      <List sx={{ backgroundColor: "#551756" }}>
  {menu.map((text, index) => (
    <ListItem key={text.name} disablePadding sx={{ display: 'block' }}>
      <ListItemButton
      selected={listItemSelected}
        sx={{
          minHeight: 48,
          px: 2.5,
          color: "white",
          justifyContent: open ? "initial" : "center",
          '&:hover': {
            backgroundColor: "#752a9b", // slightly lighter purple
          },
          '&.Mui-selected': {
            backgroundColor: listItemSelected === text.name ? "#ff4081" : "#551756", // pink highlight for selected
            color: "white",
            '&:hover': {
              backgroundColor:listItemSelected === text.name ? "#f50057" : "#752a9b", // darker pink on hover for selected
            },
          },
        }}
        onClick={()=>listItemButtonclick(text)}
      >
        <ListItemIcon
          sx={{
            minWidth: 0,
            justifyContent: "center",
            color: "white",
            mr: open ? 3 : "auto",
          }}
        >
          {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
        </ListItemIcon>
        <ListItemText
          primary={text.name}
          sx={{
            opacity: open ? 1 : 0,
          }}
        />
      </ListItemButton>
    </ListItem>
  ))}
</List>

        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
       {children}
      </Box>
    </Box>
  );
}