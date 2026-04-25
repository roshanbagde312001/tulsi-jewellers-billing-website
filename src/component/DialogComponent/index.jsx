<<<<<<< HEAD
import { Grid, TextField, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import * as React from 'react';

export default function FormDialog({handelAddItembuttoncallback,ismodalOpen,setmodalOpen,editarrayvar,setflagforedit,flagforedit,handelUpdateItembuttoncallback}) {

  const handleClose = () => {
    setflagforedit(false)
    setmodalOpen(false);
  };

  React.useEffect(() => {
  // side-effect code here
  if(flagforedit){
      setformData({
          ...formData,
          Description: editarrayvar.Description,
          Weight:editarrayvar.Weight,
          Rate:editarrayvar.Rate,
          Hallmarking_Charges:editarrayvar.Hallmarking_Charges,
          Making_Charges:editarrayvar.Making_Charges,
          uinumber: editarrayvar.uinumber
        })
    }
}, []);
    const [formData,setformData]=React.useState({
        Description:"",
        Weight:"",
        Rate:"",
        Making_Charges:"",
        Hallmarking_Charges:"",
        uinumber:""
    })

    const handleOnchage=(e,item)=>{
       setformData({
      ...formData,
      [item]: e.target.value
    })
    }

  return (
    <React.Fragment>
      <Dialog 
      open={ismodalOpen} 
      onClose={handleClose}
      PaperProps={{
    sx: {
      width: "600px",   // set custom width
      maxWidth: "none", // disable default maxWidth
      borderRadius: 3
    }
  }}
      >
        {/* <DialogTitle>Subscribe</DialogTitle> */}
        <DialogContent>
          <DialogContentText sx={{paddingTop:"2rem"}}>
            <Grid container>
                <Grid size={{xs:12,md:12}} sx={{display:"flex",alignContent:"center",alignItems:"center",justifyContent:"space-between"}}>
                    <Typography>Description :</Typography>
                    <TextField 
                    multiline
                    rows={2}
                    value={formData.Description}
                    size='small' 
                    onChange={(e)=>handleOnchage(e,"Description")}
                    sx={{width:"70%"}}/>
                </Grid>
                <Grid size={{xs:12,md:12}} sx={{marginTop:'1.5rem',display:"flex",alignContent:"center",alignItems:"center",justifyContent:"space-between"}}>
                <Typography>Weight :</Typography>
                <TextField
                size='small'
                sx={{width:"70%"}}
                value={formData.Weight}
                type='number'
                onChange={(e)=>handleOnchage(e,"Weight")}

                />
                </Grid>

                <Grid size={{xs:12,md:12}} sx={{marginTop:'1.5rem',display:"flex",alignContent:"center",alignItems:"center",justifyContent:"space-between"}}>
                <Typography>Rate :</Typography>
                <TextField
                size='small'
                sx={{width:"70%"}}
                type='number'
                onChange={(e)=>handleOnchage(e,"Rate")}
                value={formData.Rate}
                />
                </Grid>
                
                <Grid size={{xs:12,md:12}} sx={{marginTop:'1.5rem',display:"flex",alignContent:"center",alignItems:"center",justifyContent:"space-between"}}>
                <Typography>Making Charges :</Typography>
                <TextField
                size='small'
                type='number'
                value={formData.Making_Charges}
                onChange={(e)=>handleOnchage(e,"Making_Charges")}
                sx={{width:"70%"}}
                />
                </Grid>

                <Grid size={{xs:12,md:12}} sx={{marginTop:'1.5rem',display:"flex",alignContent:"center",alignItems:"center",justifyContent:"space-between"}}>
                <Typography>Hallmarking Charges :</Typography>
                <TextField
                size='small'
                type='number'
                value={formData.Hallmarking_Charges}
                onChange={(e)=>handleOnchage(e,"Hallmarking_Charges")}
                sx={{width:"70%"}}
                />
                </Grid>
            </Grid>
          </DialogContentText>
         
        </DialogContent>
        <DialogActions sx={{paddingRight:"1.5rem",paddingBottom:"1rem"}}>
          <Button variant='outlined' onClick={handleClose}>Cancel</Button>
          <Button sx={{background:"	#551756",color:"white"}} onClick={!flagforedit ? ()=>handelAddItembuttoncallback(formData) : ()=>handelUpdateItembuttoncallback(formData)}>
            {!flagforedit ? "ADD" : "UPDATE"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
=======
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import * as React from "react";

const initialFormState = {
  Description: "",
  Gross_Weight: "",
  Weight: "",
  Rate: "",
  Making_Charges: "",
  Hallmarking_Charges: "",
  uinumber: "",
};

export default function FormDialog({
  handelAddItembuttoncallback,
  ismodalOpen,
  setmodalOpen,
  editarrayvar,
  setflagforedit,
  flagforedit,
  handelUpdateItembuttoncallback,
}) {
  const [formData, setformData] = React.useState(initialFormState);

  React.useEffect(() => {
    if (ismodalOpen) {
      setformData(
        flagforedit
          ? {
              Description: editarrayvar.Description || "",
              Gross_Weight: editarrayvar.Gross_Weight || "",
              Weight: editarrayvar.Weight || "",
              Rate: editarrayvar.Rate || "",
              Hallmarking_Charges: editarrayvar.Hallmarking_Charges || "",
              Making_Charges: editarrayvar.Making_Charges || "",
              uinumber: editarrayvar.uinumber || "",
            }
          : initialFormState
      );
    }
  }, [editarrayvar, flagforedit, ismodalOpen]);

  const handleClose = () => {
    setflagforedit(false);
    setmodalOpen(false);
    setformData(initialFormState);
  };

  const handleOnChange = (e, item) => {
    setformData({
      ...formData,
      [item]: e.target.value,
    });
  };

  const handleSubmit = () => {
    if (flagforedit) {
      handelUpdateItembuttoncallback(formData);
      return;
    }
    handelAddItembuttoncallback(formData);
  };

  return (
    <Dialog
      open={ismodalOpen}
      onClose={handleClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 720,
          borderRadius: 5,
          background: "#ffffff",
          color: "var(--text-primary)",
          border: "1px solid #d9e2ec",
          boxShadow: "0 20px 50px rgba(15, 23, 42, 0.12)",
        },
      }}
    >
      <DialogContent sx={{ px: { xs: 2.5, md: 3.5 }, py: 3 }}>
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "center", mb: 3 }}>
          <Box className="gold-accent" sx={{ width: 52, height: 52, borderRadius: 3, display: "grid", placeItems: "center" }}>
            <Inventory2RoundedIcon />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {flagforedit ? "Update item details" : "Add a new jewellery item"}
            </Typography>
            <Typography sx={{ color: "var(--text-muted)" }}>
              Fill the item values below and the billing screen will calculate the final amount automatically.
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 12 }}>
            <TextField
              label="Item description"
              multiline
              rows={3}
              value={formData.Description}
              onChange={(e) => handleOnChange(e, "Description")}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Gross weight"
              type="number"
              value={formData.Gross_Weight}
              onChange={(e) => handleOnChange(e, "Gross_Weight")}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">gm</InputAdornment>,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Net weight"
              type="number"
              value={formData.Weight}
              onChange={(e) => handleOnChange(e, "Weight")}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">gm</InputAdornment>,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Rate"
              type="number"
              value={formData.Rate}
              onChange={(e) => handleOnChange(e, "Rate")}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Making charges"
              type="number"
              value={formData.Making_Charges}
              onChange={(e) => handleOnChange(e, "Making_Charges")}
              fullWidth
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="Hallmarking charges"
              type="number"
              value={formData.Hallmarking_Charges}
              onChange={(e) => handleOnChange(e, "Hallmarking_Charges")}
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3.5, pb: 3, pt: 0 }}>
        <Button variant="outlined" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          {flagforedit ? "Update item" : "Add item"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
>>>>>>> 460084d (pushded the updated changess of the billing software)
