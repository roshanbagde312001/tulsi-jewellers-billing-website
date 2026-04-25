import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import LocalPrintshopRoundedIcon from "@mui/icons-material/LocalPrintshopRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PlaylistAddRoundedIcon from "@mui/icons-material/PlaylistAddRounded";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import FormDialog from "../DialogComponent";

const emptyCustomer = {
  name: "",
  mobile: "",
  date: "",
  address: "",
};

const emptyPreviousPurchase = {
  billno: "",
  Gross_Wt: "",
  Net_Wt: "",
};

const accountDetails = [
  ["Account Name", "Tulsi Jewellers"],
  ["GST Number", "22AAAAA0000A1Z5"],
  ["Bank Name", "State Bank of India"],
  ["Account Number", "XXXX XXXX XXXX 1234"],
  ["IFSC Code", "SBIN0001234"],
  ["Branch", "Main Branch"],
];

const formatMoney = (value) => `Rs ${Number(value || 0).toFixed(2)}`;
const GOOGLE_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const GOOGLE_CLIENT_ID = "65746027720-7dr5nbggtblbbcsk1g6bghr7lkebtc43.apps.googleusercontent.com";

const Bill = () => {
  const billRef = useRef(null);
  const tokenClientRef = useRef(null);
  const accessTokenRef = useRef(null);
  const [ismodalOpen, setmodalOpen] = useState(false);
  const [editarrayvar, seteditarrayvar] = useState({});
  const [flagforedit, setflagforedit] = useState(false);
  const [oldamount, setoldamount] = useState(0);
  const [billDetails, setbillDetails] = useState([]);
  const [customer, setCustomer] = useState(emptyCustomer);
  const [previousPurchase, setpreviousPurchase] = useState(emptyPreviousPurchase);
  const [driveReady, setDriveReady] = useState(false);
  const [isUploadingToDrive, setIsUploadingToDrive] = useState(false);
  const [driveStatus, setDriveStatus] = useState("");

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      setDriveStatus("Add REACT_APP_GOOGLE_CLIENT_ID to enable Google Drive uploads.");
      return undefined;
    }

    const existingScript = document.querySelector('script[data-google-gsi="true"]');
    if (existingScript && window.google?.accounts?.oauth2) {
      tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: GOOGLE_DRIVE_SCOPE,
        callback: () => {},
      });
      setDriveReady(true);
      return undefined;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleGsi = "true";
    script.onload = () => {
      if (window.google?.accounts?.oauth2) {
        tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: GOOGLE_DRIVE_SCOPE,
          callback: () => {},
        });
        setDriveReady(true);
        setDriveStatus("");
      }
    };
    script.onerror = () => {
      setDriveStatus("Google Drive setup failed to load. Check your internet connection and OAuth configuration.");
    };
    document.body.appendChild(script);

    return () => {
      if (!existingScript && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: billRef,
    documentTitle: "Jewellery Bill",
    pageStyle: `
      @media print {
        body {
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
          font-family: Arial, sans-serif;
        }
      }
    `,
  });

  const calculateItemTotal = (itemdata) => {
    const baseValue = (Number(itemdata.Weight) || 0) * (Number(itemdata.Rate) || 0);
    const makingValue = (baseValue / 100) * (Number(itemdata.Making_Charges) || 0);
    const finalValue = baseValue + makingValue + (Number(itemdata.Hallmarking_Charges) || 0);
    return finalValue.toFixed(2);
  };

  const generateUniqueId = () => `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  const handelCalcuate = () => {
    seteditarrayvar({});
    setflagforedit(false);
    setmodalOpen(true);
  };

  const handelUpdateItembuttoncallback = (itemdata) => {
    const updatedItem = { ...itemdata, Total: calculateItemTotal(itemdata) };
    setbillDetails((prev) =>
      prev.map((item) => (item.uinumber === updatedItem.uinumber ? updatedItem : item))
    );
    setmodalOpen(false);
  };

  const handelAddItembuttoncallback = (itemdata) => {
    const updatedItem = {
      ...itemdata,
      Total: calculateItemTotal(itemdata),
      uinumber: generateUniqueId(),
    };
    setbillDetails((prev) => [...prev, updatedItem]);
    setmodalOpen(false);
  };

  const handelEditbuttonclik = (item) => {
    setflagforedit(true);
    seteditarrayvar(item);
    setmodalOpen(true);
  };

  const handelDeletebuttonclick = (item) => {
    setflagforedit(false);
    setbillDetails((prev) => prev.filter((entry) => entry.uinumber !== item.uinumber));
  };

  const handleDownloadPDF = async () => {
    const pdf = await buildInvoicePdf();
    pdf.save("jewellery_bill.pdf");
  };

  const buildInvoicePdf = async () => {
    const element = billRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    return pdf;
  };

  const getDriveAccessToken = async () =>
    new Promise((resolve, reject) => {
      if (!tokenClientRef.current) {
        reject(new Error("Google Drive is not configured yet."));
        return;
      }

      tokenClientRef.current.callback = (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        accessTokenRef.current = response.access_token;
        resolve(response.access_token);
      };

      tokenClientRef.current.requestAccessToken({
        prompt: accessTokenRef.current ? "" : "consent",
      });
    });

  const uploadPdfToDrive = async () => {
    if (!billDetails.length) {
      setDriveStatus("Add at least one item before saving the bill to Google Drive.");
      return;
    }

    if (!GOOGLE_CLIENT_ID) {
      setDriveStatus("Google Drive upload is disabled until REACT_APP_GOOGLE_CLIENT_ID is configured.");
      return;
    }

    try {
      setIsUploadingToDrive(true);
      setDriveStatus("Connecting to Google Drive...");
      const token = await getDriveAccessToken();
      setDriveStatus("Generating PDF for Drive upload...");
      const pdf = await buildInvoicePdf();
      const pdfBlob = pdf.output("blob");
      const fileName = `bill-${customer.name || "customer"}-${customer.date || Date.now()}.pdf`;
      const metadata = {
        name: fileName.replace(/\s+/g, "-"),
        mimeType: "application/pdf",
      };
      const boundary = `bill-upload-${Date.now()}`;
      const delimiter = `\r\n--${boundary}\r\n`;
      const closeDelimiter = `\r\n--${boundary}--`;
      const pdfBuffer = await pdfBlob.arrayBuffer();
      const body = new Blob(
        [
          delimiter,
          "Content-Type: application/json; charset=UTF-8\r\n\r\n",
          JSON.stringify(metadata),
          delimiter,
          "Content-Type: application/pdf\r\n\r\n",
          pdfBuffer,
          closeDelimiter,
        ],
        { type: `multipart/related; boundary=${boundary}` }
      );

      const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": `multipart/related; boundary=${boundary}`,
        },
        body,
      });

      if (!response.ok) {
        throw new Error("Upload request failed.");
      }

      const data = await response.json();
      setDriveStatus(`Saved to Google Drive successfully. File ID: ${data.id}`);
    } catch (error) {
      setDriveStatus(`Google Drive upload failed: ${error.message}`);
    } finally {
      setIsUploadingToDrive(false);
    }
  };

  const grandTotal = billDetails.reduce((sum, item) => sum + Number(item.Total || 0), 0);

  const calculatecgst = () => ((grandTotal || 0) * 1.5) / 100;

  const subtotal = () => (grandTotal + calculatecgst() * 2).toFixed(2);

  const handeloldamountchange = (e) => {
    setoldamount(e.target.value);
  };

  const handelonchangeforoldbild = (e, item) => {
    setpreviousPurchase({
      ...previousPurchase,
      [item]: e.target.value,
    });
  };

  const netamountcal = () => {
    const value = Number(subtotal()) - Number(oldamount || 0);
    return value.toFixed(2);
  };

  const handelheaderInputChange = (e, item) => {
    const { value } = e.target;
    if (item === "mobile" && value.length > 10) {
      return;
    }
    setCustomer({
      ...customer,
      [item]: value,
    });
  };

  return (
    <Box className="page-shell">
      {/* <Box className="hero-banner">
        <Chip label="Jewellery Billing Desk" className="hero-chip" />
        <Typography variant="h3" className="hero-title">
          Simple and professional jewellery billing
        </Typography>
        <Typography className="hero-description">
          This screen is designed for easy day-to-day billing with a clean layout, clear sections, and a more enterprise-grade presentation.
        </Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {summaryCards.map((card) => (
            <Grid key={card.label} size={{ xs: 12, md: 4 }}>
              <Paper className="app-card" sx={{ height: "100%" }}>
                <Typography className="section-eyebrow">{card.label}</Typography>
                <Typography sx={{ mt: 1.2, color: "var(--text-secondary)" }}>{card.text}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box> */}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, xl: 8 }}>
          <Paper className="app-card">
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
              <Box className="gold-accent" sx={{ width: 50, height: 50, borderRadius: 3, display: "grid", placeItems: "center" }}>
                <PersonOutlineRoundedIcon />
              </Box>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Customer and billing details
                </Typography>
                <Typography sx={{ color: "var(--text-muted)" }}>
                  Capture buyer information before adding jewellery line items.
                </Typography>
              </Box>
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Customer name" fullWidth value={customer.name} onChange={(e) => handelheaderInputChange(e, "name")} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Billing date"
                  type="date"
                  fullWidth
                  value={customer.date}
                  onChange={(e) => handelheaderInputChange(e, "date")}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Mobile number" type="number" fullWidth value={customer.mobile} onChange={(e) => handelheaderInputChange(e, "mobile")} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Address" fullWidth value={customer.address} onChange={(e) => handelheaderInputChange(e, "address")} />
              </Grid>
            </Grid>

            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 3 }}>
              <Button variant="contained" startIcon={<PlaylistAddRoundedIcon />} onClick={handelCalcuate}>
                Add items
              </Button>
              <Button variant="outlined" startIcon={<LocalPrintshopRoundedIcon />} onClick={() => handlePrint()}>
                Print invoice
              </Button>
              <Button variant="outlined" startIcon={<DownloadRoundedIcon />} onClick={handleDownloadPDF}>
                Download PDF
              </Button>
              {/* <Button
                variant="outlined"
                startIcon={<CloudUploadRoundedIcon />}
                onClick={uploadPdfToDrive}
                disabled={!driveReady || isUploadingToDrive}
              >
                {isUploadingToDrive ? "Saving..." : "Save to Drive"}
              </Button> */}
            </Stack>
            <Typography sx={{ color: "var(--text-muted)", mt: 1.5, fontSize: "0.9rem" }}>
              {driveStatus ||
                "Google Drive upload uses your Google account permission and stores the generated PDF in My Drive."}
            </Typography>
          </Paper>

          <Paper className="app-card" sx={{ mt: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Itemised bill
                </Typography>
                <Typography sx={{ color: "var(--text-muted)" }}>
                  Review all jewellery items with edit and delete controls.
                </Typography>
              </Box>
              <Chip label={`${billDetails.length} items`} className="hero-chip" />
            </Stack>

            {billDetails.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Sr.</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Gross Wt.</TableCell>
                      <TableCell>Net Wt.</TableCell>
                      <TableCell>Rate</TableCell>
                      <TableCell>Making</TableCell>
                      <TableCell>Hallmark</TableCell>
                      <TableCell>Total</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {billDetails.map((item, key) => (
                      <TableRow key={item.uinumber}>
                        <TableCell>{key + 1}</TableCell>
                        <TableCell sx={{ maxWidth: 260 }}>{item.Description}</TableCell>
                        <TableCell>{item.Gross_Weight || "-"} gm</TableCell>
                        <TableCell>{item.Weight} gm</TableCell>
                        <TableCell>{formatMoney(item.Rate)}</TableCell>
                        <TableCell>{item.Making_Charges}%</TableCell>
                        <TableCell>{formatMoney(item.Hallmarking_Charges)}</TableCell>
                        <TableCell>{formatMoney(item.Total)}</TableCell>
                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Tooltip title="Edit item">
                              <IconButton onClick={() => handelEditbuttonclik(item)}>
                                <EditRoundedIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete item">
                              <IconButton onClick={() => handelDeletebuttonclick(item)}>
                                <DeleteOutlineRoundedIcon />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box className="empty-state">
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  No items added yet
                </Typography>
                <Typography sx={{ color: "var(--text-muted)", maxWidth: 520 }}>
                  Start by adding the first jewellery item. Gross weight is stored for reference, while the total is calculated from net weight, rate, making charges, and hallmarking charges.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, xl: 4 }}>
          <Paper className="app-card">
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
              Purchase adjustment
            </Typography>
            <Typography sx={{ color: "var(--text-muted)", mb: 2.5 }}>
              Record exchange bill information and deduct the prior purchase value from the final amount.
            </Typography>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <TextField label="Previous bill number" fullWidth value={previousPurchase.billno} onChange={(e) => handelonchangeforoldbild(e, "billno")} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Gross weight" fullWidth value={previousPurchase.Gross_Wt} onChange={(e) => handelonchangeforoldbild(e, "Gross_Wt")} />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField label="Net weight" fullWidth value={previousPurchase.Net_Wt} onChange={(e) => handelonchangeforoldbild(e, "Net_Wt")} />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label="Adjustment amount"
                  type="number"
                  fullWidth
                  value={oldamount}
                  onChange={handeloldamountchange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper className="app-card" sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Amount summary
            </Typography>
            <Stack spacing={1.5}>
              <Box className="summary-row">
                <Typography>Total amount</Typography>
                <Typography>{formatMoney(grandTotal)}</Typography>
              </Box>
              <Box className="summary-row">
                <Typography>CGST 1.5%</Typography>
                <Typography>{formatMoney(calculatecgst())}</Typography>
              </Box>
              <Box className="summary-row">
                <Typography>SGST 1.5%</Typography>
                <Typography>{formatMoney(calculatecgst())}</Typography>
              </Box>
              <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />
              <Box className="summary-row">
                <Typography>Sub total</Typography>
                <Typography>{formatMoney(subtotal())}</Typography>
              </Box>
              <Box className="summary-row">
                <Typography>Less URD</Typography>
                <Typography>{formatMoney(oldamount)}</Typography>
              </Box>
              <Box className="summary-row summary-row--highlight">
                <Typography>Net amount</Typography>
                <Typography>{formatMoney(netamountcal())}</Typography>
              </Box>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ position: "absolute", left: -9999, top: 0 }}>
        <Box ref={billRef} sx={{ width: 794, bgcolor: "#ffffff", color: "#111827", p: 4 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
            <Box>
              <Typography sx={{ fontSize: 28, fontWeight: 800, letterSpacing: "0.08em" }}>
                TULSI JEWELLERS
              </Typography>
              <Typography sx={{ color: "#6b7280" }}>Professional jewellery invoice</Typography>
            </Box>
            <Box sx={{ textAlign: "right" }}>
              <Typography sx={{ fontWeight: 700 }}>Invoice Date</Typography>
              <Typography>{customer.date || "-"}</Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 6, md: 6 }}>
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Bill To</Typography>
              <Typography>Name: {customer.name || "-"}</Typography>
              <Typography>Mobile: {customer.mobile || "-"}</Typography>
              <Typography>Address: {customer.address || "-"}</Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 6 }}>
              <Typography sx={{ fontWeight: 700, mb: 0.5 }}>Previous Purchase</Typography>
              <Typography>Bill No: {previousPurchase.billno || "-"}</Typography>
              <Typography>Gross Wt: {previousPurchase.Gross_Wt || "-"}</Typography>
              <Typography>Net Wt: {previousPurchase.Net_Wt || "-"}</Typography>
            </Grid>
          </Grid>

          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #d1d5db", mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                  <TableCell>Sr.</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Gross Wt.</TableCell>
                  <TableCell>Net Wt.</TableCell>
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
                    <TableCell>{item.Gross_Weight || "-"} gm</TableCell>
                    <TableCell>{item.Weight} gm</TableCell>
                    <TableCell>{formatMoney(item.Rate)}</TableCell>
                    <TableCell>{item.Making_Charges}%</TableCell>
                    <TableCell>{formatMoney(item.Hallmarking_Charges)}</TableCell>
                    <TableCell>{formatMoney(item.Total)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 3 }}>
            <Box
              sx={{
                flex: 1,
                border: "1px solid #d1d5db",
                borderRadius: 2,
                p: 2,
                minHeight: 210,
                backgroundColor: "#fafafa",
              }}
            >
              <Typography sx={{ fontWeight: 700, mb: 1.5 }}>Account Details</Typography>
              {accountDetails.map(([label, value]) => (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 2,
                    py: 0.7,
                    borderBottom: "1px solid #e5e7eb",
                  }}
                >
                  <Typography sx={{ color: "#4b5563", fontWeight: 600 }}>{label}</Typography>
                  <Typography sx={{ textAlign: "right" }}>{value}</Typography>
                </Box>
              ))}
            </Box>

            <Box sx={{ width: 320, border: "1px solid #d1d5db", borderRadius: 2, overflow: "hidden" }}>
              {[
                ["Total Amount", formatMoney(grandTotal)],
                ["CGST 1.5%", formatMoney(calculatecgst())],
                ["SGST 1.5%", formatMoney(calculatecgst())],
                ["Sub Total", formatMoney(subtotal())],
                ["Less URD", formatMoney(oldamount)],
                ["Net Amount", formatMoney(netamountcal())],
              ].map(([label, value], index) => (
                <Box
                  key={label}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.25,
                    backgroundColor: index === 5 ? "#fff7e5" : "#ffffff",
                    borderBottom: index === 5 ? "none" : "1px solid #e5e7eb",
                    fontWeight: index === 5 ? 700 : 500,
                  }}
                >
                  <Typography>{label}</Typography>
                  <Typography>{value}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          <Box sx={{ mt: 7, display: "flex", justifyContent: "space-between" }}>
            <Typography>Customer Signature</Typography>
            <Typography>Authorised Signatory</Typography>
          </Box>
        </Box>
      </Box>

      {ismodalOpen && (
        <FormDialog
          setflagforedit={setflagforedit}
          flagforedit={flagforedit}
          editarrayvar={editarrayvar}
          handelAddItembuttoncallback={handelAddItembuttoncallback}
          handelUpdateItembuttoncallback={handelUpdateItembuttoncallback}
          ismodalOpen={ismodalOpen}
          setmodalOpen={setmodalOpen}
        />
      )}
    </Box>
  );
};

export default Bill;
