import AddShoppingCartRoundedIcon from "@mui/icons-material/AddShoppingCartRounded";
import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import DiamondRoundedIcon from "@mui/icons-material/DiamondRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {
  Box,
  Chip,
  CssBaseline,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDrawerContext } from "../drawerContext";

const drawerWidth = 280;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(8)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: theme.spacing(0, 1.5),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  background: "#ffffff",
  borderBottom: "1px solid #d9e2ec",
  boxShadow: "0 4px 20px rgba(15, 23, 42, 0.04)",
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.easeOut,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const iconsByRoute = {
  "/generateBill": <AddShoppingCartRoundedIcon />,
  "/Bills": <DescriptionRoundedIcon />,
};

export default function MiniDrawer({ children }) {
  const { open, toggleIsOpened, menu } = useDrawerContext();
  const [listItemSelected, setListItemSelected] = useState("Generate Bill");
  const navigate = useNavigate();

  const handleNavigate = (item) => {
    navigate(item.route);
    setListItemSelected(item.name);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: "var(--bg-primary)",
      }}
    >
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ gap: 2, minHeight: 80 }}>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            onClick={toggleIsOpened}
            edge="start"
            sx={{
              color: "var(--text-primary)",
              border: "1px solid #d9e2ec",
              backgroundColor: "#f8fafc",
              ...(open && { display: "none" }),
            }}
          >
            <MenuRoundedIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 700, letterSpacing: "0.08em" }}
            >
              Tulsi Jewellers
            </Typography>
            <Typography sx={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Billing and invoice workspace
            </Typography>
          </Box>
          <Chip
            label="Professional Billing Suite"
            sx={{
              color: "var(--text-primary)",
              backgroundColor: "var(--accent-gold-soft)",
              border: "1px solid #cddcff",
            }}
          />
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        open={open}
        sx={{
          "& .MuiDrawer-paper": {
            borderRight: "1px solid #d9e2ec",
            background: "#ffffff",
            color: "var(--text-primary)",
          },
        }}
      >
        <DrawerHeader>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              opacity: open ? 1 : 0,
              transition: "opacity 0.2s ease",
            }}
          >
            <Box className="gold-accent" sx={{ width: 42, height: 42, borderRadius: 3, display: "grid", placeItems: "center" }}>
              <DiamondRoundedIcon />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700 }}>Billing Desk</Typography>
              <Typography sx={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Retail operations
              </Typography>
            </Box>
          </Box>
          <IconButton onClick={toggleIsOpened} sx={{ color: "var(--text-primary)" }}>
            <ChevronLeftRoundedIcon
              sx={{
                transform: open ? "rotate(0deg)" : "rotate(180deg)",
                transition: "transform 0.2s ease",
              }}
            />
          </IconButton>
        </DrawerHeader>
        <Divider sx={{ borderColor: "#e6edf5" }} />

        <Box sx={{ px: open ? 2 : 1, py: 2 }}>
          <Typography
            sx={{
              px: open ? 1.5 : 0,
              pb: 1.5,
              fontSize: "0.76rem",
              letterSpacing: "0.12em",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              textAlign: open ? "left" : "center",
            }}
          >
            Workspace
          </Typography>
          <List sx={{ display: "grid", gap: 1 }}>
            {menu.map((item) => {
              const selected = listItemSelected === item.name;
              return (
                <ListItem key={item.name} disablePadding sx={{ display: "block" }}>
                  <ListItemButton
                    selected={selected}
                    onClick={() => handleNavigate(item)}
                    sx={{
                      minHeight: 54,
                      px: 1.5,
                      borderRadius: 3,
                      justifyContent: open ? "initial" : "center",
                      backgroundColor: selected ? "#edf3ff" : "transparent",
                      border: selected
                        ? "1px solid #d6e3ff"
                        : "1px solid transparent",
                      "&:hover": {
                        backgroundColor: "#f7f9fc",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 1.75 : "auto",
                        justifyContent: "center",
                        color: selected ? "var(--accent-gold)" : "var(--text-primary)",
                      }}
                    >
                      {iconsByRoute[item.route]}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.name}
                      secondary={item.route === "/generateBill" ? "Create and print invoices" : "Review records"}
                      sx={{
                        opacity: open ? 1 : 0,
                        "& .MuiListItemText-primary": { fontWeight: 600 },
                        "& .MuiListItemText-secondary": {
                          color: "var(--text-muted)",
                          fontSize: "0.76rem",
                        },
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        <Box sx={{ mt: "auto", p: open ? 2 : 1.2 }}>
          <Box
            sx={{
              borderRadius: 4,
              p: open ? 2 : 1,
              background: "#f8fbff",
              border: "1px solid #d8e4f3",
              textAlign: open ? "left" : "center",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: open ? "0.95rem" : "0.8rem" }}>
              {open ? "Daily Billing" : "Live"}
            </Typography>
            {open && (
              <Typography sx={{ mt: 0.5, fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Generate polished jewellery invoices faster with clear customer details and item summaries.
              </Typography>
            )}
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: { xs: 2, md: 4 },
          pb: 4,
        }}
      >
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
}
