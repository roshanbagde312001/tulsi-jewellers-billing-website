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