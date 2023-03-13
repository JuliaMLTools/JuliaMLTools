import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../src/ProTip';
import Link from '../src/Link';
import Copyright from '../src/Copyright.js';
import NestedList from '../src/NestedList';
import { Card } from '@mui/material';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import { redirect } from "react-router-dom";
import Router from 'next/router';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

export default function Index(){
    useEffect(() => {
        Router.push('/transformer-blocks');
    }, []);
    return <p></p>;
}
