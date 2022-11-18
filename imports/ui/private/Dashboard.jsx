import * as React from 'react';

import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link'

import Chart from './template/Chart';
import TopSales from './template/TopSales';
import Currencies from './template/Currencies';
import SoldOut from './template/SoldOut';
import TodaySales from './template/TodaySales';
import TodayCustomers from './template/TodayCustomers';
import Chart2 from './template/Chart2';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mantapagungsejati.com/">
        mantapagungsejati.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function DashboardContent() {

  return (
    <>
      <Grid container spacing={2}>
        {/* Chart */}
        <Grid item xs={12} md={7} lg={8}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Chart />
          </Paper>
        </Grid>
        <Grid item xs={12} md={5} lg={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <TopSales />
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} lg={6} container spacing={2}>
          <Grid item xs={12} md={6} lg={6}>
            <Paper sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <TodaySales />
            </Paper>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Paper sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <TodayCustomers />
            </Paper>
          </Grid>
          <Grid item xs={12} md={12} lg={12}>
            <Paper sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <SoldOut />
            </Paper>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Paper sx={{
            p: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%'
          }}>
            <Chart2 />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <Currencies />
          </Paper>
        </Grid>

      </Grid>
      <Copyright sx={{ pt: 4 }} />
    </>
  );
}

export function DashboardPage() {
  return <DashboardContent />;
}