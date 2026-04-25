import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import InsightsRoundedIcon from "@mui/icons-material/InsightsRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import {
  Box,
  Chip,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const previewBills = [
  { id: "INV-2401", customer: "Megha Sharma", amount: "Rs 1,28,450", status: "Ready to print" },
  { id: "INV-2402", customer: "Ajay Verma", amount: "Rs 84,275", status: "Draft" },
  { id: "INV-2403", customer: "Nitika Jain", amount: "Rs 2,16,880", status: "Shared" },
];

const metricCards = [
  { title: "Invoices this month", value: "128", helper: "8% higher than last month", icon: <ReceiptLongRoundedIcon /> },
  { title: "Average ticket size", value: "Rs 91,320", helper: "Includes tax and adjustments", icon: <InsightsRoundedIcon /> },
  { title: "Archive readiness", value: "92%", helper: "Records prepared for storage", icon: <ArchiveRoundedIcon /> },
];

export const GetBills = () => {
  return (
    <Box className="page-shell">
      <Box className="hero-banner">
        <Chip label="Bill Archive" className="hero-chip" />
        <Typography variant="h3" className="hero-title">
          Saved bills workspace
        </Typography>
        <Typography className="hero-description">
          A clean archive view for reviewing invoice records with a layout that matches the main billing workspace.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {metricCards.map((card) => (
          <Grid key={card.title} size={{ xs: 12, md: 4 }}>
            <Paper className="app-card" sx={{ height: "100%" }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                <Box>
                  <Typography className="section-eyebrow">{card.title}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mt: 1 }}>
                    {card.value}
                  </Typography>
                </Box>
                <Box className="gold-accent" sx={{ width: 48, height: 48, borderRadius: 3, display: "grid", placeItems: "center" }}>
                  {card.icon}
                </Box>
              </Box>
              <Typography sx={{ color: "var(--text-muted)" }}>{card.helper}</Typography>
            </Paper>
          </Grid>
        ))}

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper className="app-card">
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Recent bill previews
                </Typography>
                <Typography sx={{ color: "var(--text-muted)" }}>
                  Sample records are shown here until storage and search are connected.
                </Typography>
              </Box>
              <Chip label="Preview Mode" className="hero-chip" />
            </Stack>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Invoice ID</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {previewBills.map((bill) => (
                    <TableRow key={bill.id}>
                      <TableCell>{bill.id}</TableCell>
                      <TableCell>{bill.customer}</TableCell>
                      <TableCell>{bill.amount}</TableCell>
                      <TableCell>
                        <Chip label={bill.status} size="small" className="hero-chip" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper className="app-card" sx={{ height: "100%" }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
              Next upgrade path
            </Typography>
            <Stack spacing={1.5}>
              <Typography sx={{ color: "var(--text-muted)" }}>
                1. Store generated bills in local storage or backend.
              </Typography>
              <Typography sx={{ color: "var(--text-muted)" }}>
                2. Add search by customer name, mobile number, or invoice number.
              </Typography>
              <Typography sx={{ color: "var(--text-muted)" }}>
                3. Re-open saved bills directly for printing or editing.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
