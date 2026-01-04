import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Box, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import FormDialog from '../DialogComponent';

const Bill = () => {
  const billRef = useRef(null);
  const [ismodalOpen, setmodalOpen] = useState(false)
  const [editarrayvar, seteditarrayvar] = useState({})
  const [flagforedit, setflagforedit] = useState(false)
  const [oldamount, setoldamount] = useState(0)
  let dummyvar = [{
    "Sr": 1,
    "Description": "Programs round correctly, but using the inaccurate floating-point value ",
    "Weight": "0.235",
    "Rate": "12085",
    "Making_Charges": 12,
    "hallmarkingcharges": 50,
    "Total": 0
  }]
  const [billDetails, setbillDetails] = useState([])


  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    date: "",
    address:""
  });

  const [previousPurchase,setpreviousPurchase] = useState({
    billno:"",
    "Gross_Wt":"",
    "Net_Wt":"",
  })

  const [items, setItems] = useState([
    { description: "", weight: "", price: "", amount: "" },
  ]);



  // Handle changes in item inputs
  const handleItemChange = (index, key, value) => {
    const updatedItems = [...items];
    updatedItems[index][key] = value;

    // Auto-calculate amount
    const weight = parseFloat(updatedItems[index].weight) || 0;
    const price = parseFloat(updatedItems[index].price) || 0;
    updatedItems[index].amount = weight * price;

    setItems(updatedItems);
  };

  // Calculate total
  const getTotal = () => {
    return items.reduce((sum, row) => sum + Number(row.amount || 0), 0);
  };

  // Print bill
  const handlePrint = useReactToPrint({
    contentRef: billRef,
    documentTitle: "Jewellery Bill",
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          font-family: Arial, sans-serif;
        }
        table {
          border-collapse: collapse;
        }
        table, th, td {
          border: 1px solid black;
        }
        th, td {
          padding: 8px;
        }
      }
    `,
  });

  // const handelCalcuate = () => {
  //   let dummyvariable = billDetails[0]
  //   let totalvalue = 0
  //   totalvalue = ((dummyvariable.Weight) * dummyvariable.Rate).toFixed(3)
  //   let percentvalue = ((totalvalue / 100) * dummyvariable.Making_Charges).toFixed(3)
  //   totalvalue = parseFloat(totalvalue) + parseFloat(percentvalue)
  //   totalvalue = totalvalue + dummyvariable.hallmarkingcharges
  //   let newclone = [...billDetails]
  //   let flasedata = []
  //   newclone[0].Total = totalvalue
  //   setbillDetails(newclone)
  // }

  const handelCalcuate = () => {
    seteditarrayvar({})
    setmodalOpen(true)
  }

  const generateUniqueId = () => {
    return `${Date.now()}-${Math.floor(Math.random() * 100000)}`;
  };

  const handelUpdateItembuttoncallback = (itemdata) => {
    let dummyvariable = itemdata
    let totalvalue = 0
    totalvalue = ((dummyvariable.Weight) * dummyvariable.Rate).toFixed(3)
    let percentvalue = ((totalvalue / 100) * dummyvariable.Making_Charges).toFixed(3)
    totalvalue = (parseFloat(totalvalue) + parseFloat(percentvalue)).toFixed(3)
    totalvalue = parseFloat(parseFloat(totalvalue) + parseFloat(dummyvariable.Hallmarking_Charges)).toFixed(2)
    itemdata.Total = totalvalue

    let clonedata = [...billDetails]
    clonedata = clonedata.filter((item) => item.uinumber !== itemdata.uinumber)
    clonedata.push(itemdata)
    setbillDetails(clonedata)
    setmodalOpen(false)
  }

  const handelAddItembuttoncallback = (itemdata) => {
    setflagforedit(false)
    let dummyvariable = itemdata
    let totalvalue = 0
    totalvalue = ((dummyvariable.Weight) * dummyvariable.Rate).toFixed(3)
    let percentvalue = ((totalvalue / 100) * dummyvariable.Making_Charges).toFixed(3)
    totalvalue = (parseFloat(totalvalue) + parseFloat(percentvalue)).toFixed(3)
    totalvalue = parseFloat(parseFloat(totalvalue) + parseFloat(dummyvariable.Hallmarking_Charges)).toFixed(2)
    itemdata.Total = totalvalue
    itemdata.uinumber = generateUniqueId()
    let colonedbilldetails = [...billDetails]
    colonedbilldetails.push(itemdata)

    setbillDetails(colonedbilldetails)
    setmodalOpen(false)
  }

  const handelEditbuttonclik = (item, key) => {
    setflagforedit(true)
    seteditarrayvar(item)
    setmodalOpen(true)
  }
  const handelDeletebuttonclick = (items, key) => {
    setflagforedit(false)
    let shalloclone = [...billDetails]
    let newdetails = shalloclone.filter((item) => item.uinumber !== items.uinumber)
    setbillDetails(newdetails)
  }

  // Download PDF
  const handleDownloadPDF = async () => {
    const element = billRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("jewellery_bill.pdf");
  };


  const grandTotal = billDetails.reduce(
    (sum, item) => sum + Number(item.Total || 0),
    0
  );

  const calculatecgst = () => {
    let value = grandTotal.toFixed(3)
    let cgstvalue = (value / 100)
    cgstvalue = cgstvalue * 1.5
    return cgstvalue
  }

  const subtotal = () => {
    let value = grandTotal.toFixed(3)
    let returnsubtotal = calculatecgst().toFixed(3)
    returnsubtotal = returnsubtotal * 2
    returnsubtotal = parseFloat(parseFloat(returnsubtotal) + parseFloat(value))
    return parseFloat(returnsubtotal).toFixed(3)
  }

  const handeloldamountchange = (e) => {
    setoldamount(e.target.value)
  }

  const handelonchangeforoldbild=(e,item)=>{
setpreviousPurchase({
          ...previousPurchase,
          [item]: e.target.value
        })
  }

  const netamountcal = () => {
    let value = subtotal()
    let valuetosub = 0
    if (oldamount !== "") {
      valuetosub = oldamount
    }
    value = parseFloat(value) - parseFloat(valuetosub)
    return parseFloat(value).toFixed(3)
  }

  const handelheaderInputChange=(e,item)=>{
    if(item === "mobile"){
      if((e.target.value).length <=10){
        setCustomer({
          ...customer,
          [item]: e.target.value
        })
      }
  }else{
        setCustomer({
          ...customer,
          [item]: e.target.value
        })
  }
  }

  return (
    <Grid container>
      <Grid size={{ xs: 12, md: 12 }} sx={{ justifyContent: "center", alignContent: "center", alignItems: "center", display: "flex" }}>
        <Typography variant="h4">
          Generate Bill
        </Typography>
      </Grid>

      <Grid container size={{ xs: 12, md: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
        <Paper sx={{ display: "flex", justifyContent: "center", padding: "0.5rem", paddingLeft: '2rem', marginTop: "1.5rem" }} elevation={3} >
          <Grid container size={{ xs: 12, md: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", alignItems: "center", alignContent: "center", marginTop: "1rem" }} >
              <Typography sx={{ marginRight: "2rem" }}>Name :</Typography>
              <TextField 
              sx={{ width: "70%" }} 
              value={customer.name}
              onChange={(e)=>handelheaderInputChange(e,'name')}
              size="small" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ marginTop: "1rem", display: "flex", alignContent: "center", alignItems: "center" }}>
              <Typography sx={{ marginRight: "5rem" }}>Date :</Typography>
              <TextField 
              type="date" 
              size="small" 
              onChange={(e)=>handelheaderInputChange(e,'date')}
              value={customer.date}
              sx={{ width: "70%" }} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", marginTop: "1.5rem", alignContent: "center", alignItems: "center" }}>
              <Typography sx={{ marginRight: "1rem" }}>Address :</Typography>
              <TextField 
              sx={{ width: "70%" }} 
              size="small" 
              onChange={(e)=>handelheaderInputChange(e,'address')}
              value={customer.address}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ display: "flex", marginTop: "1.5rem", alignContent: "center", alignItems: "center" }}>
              <Typography sx={{ marginRight: "2.2rem" }}>Mobile No. :</Typography>
              <TextField 
              type="number" 
              size="small" 
              sx={{ width: "70%" }} 
              value={customer.mobile}
              onChange={(e)=>handelheaderInputChange(e,'mobile')}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }} sx={{ paddingRight: "1rem", marginTop: "2rem", display: "flex", justifyContent: "end", alignContent: "center", alignItems: "center" }}>
              <Button onClick={handelCalcuate} sx={{ background: "#551756", color: "white" ,marginRight:"1rem"}}>Add Items</Button>
              <Button onClick={() => handlePrint()} sx={{ background: "#551756", color: "white" }}>Print</Button>
            </Grid>
            {billDetails.length > 0 &&
              <>
                <Grid size={{ xs: 12, md: 12 }} sx={{ marginTop: "2rem" }}>
                  <TableContainer component={Paper} elevation={3}
                    sx={{
                      maxHeight: 400,        // 👈 set max height
                      overflowY: "auto",
                    }}
                  >
                    <Table aria-label="simple table" stickyHeader
                      sx={{
                        border: "1px solid #e0e0e0",      // light grey outer border
                        borderCollapse: "collapse",
                        "& th, & td": {
                          border: "1px solid #e0e0e0",    // light grey cell borders
                        }
                      }}
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell>Sr.No </TableCell>
                          <TableCell>Description</TableCell>
                          <TableCell>Weight</TableCell>
                          <TableCell>Rate</TableCell>
                          <TableCell>Making Charges</TableCell>
                          <TableCell>Hallmarking</TableCell>
                          <TableCell>Total</TableCell>
                          <TableCell>Action Button</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {billDetails.length > 0 && billDetails.map((item, key) => (
                          <TableRow>
                            <TableCell>{key + 1}</TableCell>
                            <TableCell
                              sx={{
                                // whiteSpace: "nowrap",
                                overflow: "hidden",
                                // textOverflow: "ellipsis",
                                maxWidth: 200,
                              }}
                            >{item.Description}</TableCell>
                            <TableCell>{item.Weight} g</TableCell>
                            <TableCell>{item.Rate} /-</TableCell>
                            <TableCell>{item.Making_Charges} %</TableCell>
                            <TableCell>{item.Hallmarking_Charges} /-</TableCell>
                            <TableCell>{item.Total} /-</TableCell>




                            <TableCell>
                              <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
                                <Tooltip title="Delete Item">
                                  <IconButton onClick={() => handelDeletebuttonclick(item, key)}>
                                    <DeleteIcon />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Edit Item">
                                  <IconButton onClick={() => handelEditbuttonclik(item, key)}>
                                    <EditIcon />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </TableRow>

                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>
              </>
            }

          </Grid>
        </Paper>
      </Grid>
      <Grid container size={{ xs: 12, md: 12 }}>
        <Grid size={{ xs: 9, md: 9 }} sx={{ border: "1px solid lightgrey", padding: "1rem" }}>
          <Typography sx={{ width: "100%", marginTop: "1rem", borderBottom: "1px solid black" }}>₹ </Typography>
          <Box sx={{ marginTop: "2rem", display: "flex", justifyContent: "space-between" }}>
            <Box sx={{ width: "100%", display: "flex" }}>
              <Typography>Cash</Typography>
            </Box>
            <Box sx={{ width: "100%" }}>
              <Typography>Cheque/Online</Typography>
            </Box>
          </Box>
          <Box>
            <TableContainer>
              <Table
                sx={{
                  border: "1px solid #e0e0e0",      // light grey outer border
                  borderCollapse: "collapse",
                  "& th, & td": {
                    border: "1px solid #e0e0e0",    // light grey cell borders
                  }
                }}
              >
                <TableBody>
                  <TableRow>
                    <TableCell>Purchase Bill No.</TableCell>
                    <TableCell>Gross Wt.</TableCell>
                    <TableCell>Net Wt.</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>
                      <TextField 
                      previousPurchase
                      value={previousPurchase.billno}
                      size='small' 
                      onChange={(e)=>handelonchangeforoldbild(e,"billno")}
                      />
                      </TableCell>
                    <TableCell>
                      <TextField 
                      size='small'
                      onChange={(e)=>handelonchangeforoldbild(e,"Gross_Wt")}
                      value={previousPurchase.Gross_Wt}
                       />
                       </TableCell>
                    <TableCell>
                      <TextField 
                      size='small' 
                      onChange={(e)=>handelonchangeforoldbild(e,"Net_Wt")}
                      value={previousPurchase.Net_Wt}
                      />
                      </TableCell>
                    <TableCell>
                      <TextField
                        size='small'
                        type='number'
                        value={oldamount}
                        onChange={(e) => handeloldamountchange(e)}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
        <Grid size={{ xs: 3, md: 3 }} >
          <TableContainer>
            <Table
              sx={{
                border: "1px solid #e0e0e0",      // light grey outer border
                borderCollapse: "collapse",
                "& th, & td": {
                  border: "1px solid #e0e0e0",    // light grey cell borders
                }
              }}
            >
              <TableBody>
                <TableRow>
                  <TableCell>Total Amount :</TableCell>
                  <TableCell>{grandTotal.toFixed(3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>CGST 1.5% :</TableCell>
                  <TableCell>{calculatecgst().toFixed(3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SGST 1.5% :</TableCell>
                  <TableCell>{calculatecgst().toFixed(3)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>SUB TOTAL :</TableCell>
                  <TableCell>{subtotal()}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Less Urd [-] :</TableCell>
                  <TableCell>{oldamount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>NET AMOUNT :</TableCell>
                  <TableCell>{netamountcal()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>


      {/*  print code  */}
      <Box
        sx={{ display: "none" }}
      >
        <Box
          ref={billRef}
          sx={{
            padding: "20px",
            marginTop:"13rem",
            backgroundColor: "white",
            color: "black",
            width: "100%",
          }}
        >
          {/* HEADER */}


          {/* CUSTOMER DETAILS */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid size={{ xs: 6, md: 6 }} sx={{ display: "flex", alignContent: "center", alignItems: "center" }}>
              <Typography sx={{ marginRight: "0.5rem" }}><b>Name:</b></Typography>
              <Typography sx={{ borderBottom: "1px solid grey", width: "100%" }}>{customer.name}</Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 6 }} sx={{ display: "flex", alignContent: "center", alignItems: "center" }}>
              <Typography sx={{ marginRight: "0.5rem" }}><b>Date:</b></Typography>
              <Typography sx={{ borderBottom: "1px solid grey", width: "100%" }}>{customer.date}</Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 6 }} sx={{ display: "flex", alignContent: "center", alignItems: "center" }}>
              <Typography sx={{ marginRight: "0.5rem" }}><b>Address:</b></Typography>
              <Typography sx={{ borderBottom: "1px solid grey", width: "100%" }}>{customer.address}</Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 6 }} sx={{ display: "flex", alignContent: "center", alignItems: "center" }}>
              <Typography sx={{ marginRight: "0.5rem" }}><b>Mobile:</b></Typography>
              <Typography sx={{ borderBottom: "1px solid grey", width: "100%" }}>{customer.mobile}</Typography>
            </Grid>

          </Grid>

          {/* TABLE */}
          
          <TableContainer component={Paper} elevation={0}>
            <Table
              sx={{
                border: "1px solid #000",
                borderCollapse: "collapse",
                "& th, & td": {
                  border: "1px solid #000",
                  padding: "6px",
                },
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Sr</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Weight</TableCell>
                  <TableCell>Rate</TableCell>
                  <TableCell>Making</TableCell>
                  <TableCell>Hallmark</TableCell>
                  <TableCell>Total</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {billDetails.map((item, index) => (
                  <TableRow key={item.uinumber}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.Description}</TableCell>
                    <TableCell>{item.Weight} gram</TableCell>
                    <TableCell>₹{item.Rate}</TableCell>
                    <TableCell>{item.Making_Charges}%</TableCell>
                    <TableCell>₹{item.Hallmarking_Charges}</TableCell>
                    <TableCell>₹{item.Total}</TableCell>
                  </TableRow>
                ))}

                {billDetails.length < 2 &&
                <TableRow sx={{height:"7rem"}}>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                  </TableRow>}
              </TableBody>
            </Table>
          </TableContainer>

          {/* GRAND TOTAL */}
          <Grid container size={{ xs: 12, md: 12 }}>
            <Grid size={{ xs: 8, md: 8 }} sx={{ borderLeft: "1px solid black",borderBottom:"1px solid black", padding: "1rem" }}>
              <Typography sx={{ width: "100%", marginTop: "1rem", borderBottom: "1px solid black" }}>₹ </Typography>
              <Box sx={{ marginTop: "2rem", display: "flex", justifyContent: "space-between" }}>
                <Box sx={{ width: "100%", display: "flex" }}>
                  <Typography>Cash</Typography>
                </Box>
                <Box sx={{ width: "100%" }}>
                  <Typography>Cheque/Online</Typography>
                </Box>
              </Box>
              <Box>
                <TableContainer>
                  <Table
                    sx={{
                      border: "1px solid black",
                      borderCollapse: "collapse",
                      tableLayout: "fixed",        // 👈 VERY IMPORTANT
                      width: "100%",
                      "& td": {
                        border: "1px solid black",
                        padding: "6px",
                        // whiteSpace: "nowrap",      // 👈 STOP LINE BREAK
                        fontSize: "13px",
                      },
                    }}
                  >
                    <TableBody>
                      <TableRow>
                        <TableCell>Purchase Bill No.</TableCell>
                        <TableCell>Gross Wt.</TableCell>
                        <TableCell>Net Wt.</TableCell>
                        <TableCell>Amount</TableCell>
                      </TableRow>

                      <TableRow>
                        <TableCell>{previousPurchase.billno}</TableCell>
                        <TableCell>{previousPurchase.Gross_Wt}</TableCell>
                        <TableCell>{previousPurchase.Net_Wt}</TableCell>
                        <TableCell>
                          ₹{oldamount}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Grid>
            <Grid size={{ xs: 4, md: 4 }} >
              <TableContainer>
                <Table
                  sx={{
                    borderLeft: "1px solid black",
                    borderCollapse: "collapse",
                    tableLayout: "fixed",
                    width: "100%",
                    "& td": {
                      borderLeft: "1px solid black",
                      borderBottom:"1px solid black",
                      borderTop:"none",
                      padding: "8px 12px",     // 👈 MORE HORIZONTAL SPACE
                      whiteSpace: "nowrap",
                      fontSize: "13.5px",      // 👈 slightly bigger
                      lineHeight: 1.4,         // 👈 comfortable spacing
                    },
                  }}
                >
                  <TableBody>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: "50%",        // 👈 smaller
                          paddingRight: "6px", // 👈 reduced spacing
                          fontWeight: 500,
                        }}
                      >
                        Total Amount :
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "50%",            // 👈 more space
                          textAlign: "right",
                          paddingLeft: "14px",     // 👈 breathing room
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        ₹{grandTotal.toFixed(3)}
                      </TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        sx={{
                          width: "50%",        // 👈 smaller
                          paddingRight: "6px", // 👈 reduced spacing
                          fontWeight: 500,
                        }}
                      >CGST 1.5% :</TableCell>
                      <TableCell align="right"
                        sx={{
                          width: "50%",            // 👈 more space
                          textAlign: "right",
                          paddingLeft: "14px",     // 👈 breathing room
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >₹{calculatecgst().toFixed(3)}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        sx={{
                          width: "50%",        // 👈 smaller
                          paddingRight: "6px", // 👈 reduced spacing
                          fontWeight: 500,
                        }}
                      >SGST 1.5% :</TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          width: "50%",            // 👈 more space
                          textAlign: "right",
                          paddingLeft: "14px",     // 👈 breathing room
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >
                        ₹{calculatecgst().toFixed(3)}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        sx={{
                          width: "50%",        // 👈 smaller
                          paddingRight: "6px", // 👈 reduced spacing
                          fontWeight: 500,
                        }}
                      >
                        SUB TOTAL :
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          width: "50%",            // 👈 more space
                          textAlign: "right",
                          paddingLeft: "14px",     // 👈 breathing room
                          fontVariantNumeric: "tabular-nums",
                        }}
                      >₹{subtotal()}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell
                        sx={{
                          width: "50%",        // 👈 smaller
                          paddingRight: "6px", // 👈 reduced spacing
                          fontWeight: 500,
                        }}
                      >Less Urd [-] :</TableCell>
                      <TableCell align="right">₹{oldamount}</TableCell>
                    </TableRow>

                    <TableRow>
                      <TableCell sx={{
                        width: "50%",        // 👈 smaller
                        paddingRight: "6px", // 👈 reduced spacing
                        fontWeight: 500,
                      }}
                      >NET AMOUNT :</TableCell>
                      <TableCell
                        sx={{
                          width: "50%",            // 👈 more space
                          textAlign: "right",
                          paddingLeft: "14px",
                          fontWeight: 600,   // 👈 breathing room
                          fontVariantNumeric: "tabular-nums",
                        }}
                        align="right">
                        ₹{netamountcal()}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>

            <Grid size={{xs:12,md:12}} sx={{marginTop:"5rem",display:"flex",justifyContent:"space-between"}}>
              <Box>
              <Typography>Customer</Typography>
              <Typography>{customer.name}</Typography>
              </Box>
              <Box>
              <Typography>Tulsi Jewellers</Typography>
              <Typography>Rammilan Soni</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>



      {ismodalOpen &&
        <FormDialog
          setflagforedit={setflagforedit}
          flagforedit={flagforedit}
          editarrayvar={editarrayvar}
          handelAddItembuttoncallback={handelAddItembuttoncallback}
          handelUpdateItembuttoncallback={handelUpdateItembuttoncallback}
          ismodalOpen={ismodalOpen}
          setmodalOpen={setmodalOpen}
        />
      }
    </Grid>

  );
};

export default Bill;
