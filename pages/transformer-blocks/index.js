import * as React from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../../src/ProTip';
import Link from '../../src/Link';
import Copyright from '../../src/Copyright.js';
import NestedList from '../../src/NestedList';
import { Card } from '@mui/material';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import BasicCard from './basic-card';
import CodeBlock from './code';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const example1 = `using TransformerBlocks

# C: input embedding dimension
# T: block size (sequence length)
# B: batch size
C, T, B = 10, 5, 3
x = rand(Float32, C, T, B)

# Example 1: Transformer block
block = Block(C)
@assert size(block(x)) == (C, T, B)

# Example 2: Block with mask
using LinearAlgebra
mask = (1 .- triu(ones(Float32, T, T))) .* (-1f9)
@assert size(block(x; mask=mask)) == (C, T, B)

# Example 3: Sequential blocks
num_layers = 3
blocks = BlockList([Block(C) for _ in 1:num_layers])
@assert size(blocks(x)) == (C, T, B)
`;

export default function Index() {
    return (
        <Container maxWidth="lg">
            <Grid container spacing={2} style={{marginTop:20}}>
                <Grid xs={4} style={{paddingRight:50}}>
                    <Card variant="outlined">
                        <NestedList/>
                    </Card>
                </Grid>
                <Grid xs={8}>
                    <Typography variant="h4" component="h1" gutterBottom>
                        Package: TransformerBlocks.jl
                    </Typography>
                    <Typography color="text.secondary">
                        <Link href="https://github.com/JuliaMLTools/TransformerBlocks.jl">Source on GitHub</Link>
                    </Typography>
                    <Typography color="text.secondary">
                        <Link href="https://mui.com/getting-started/templates/">API Docs</Link>
                    </Typography>
                    
                    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary">
                        Simple, blazing fast, transformer components.
                    </Typography>
                    
                    
    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary" variant="h5">
      Basic Usage
    </Typography>
                    

                    <CodeBlock code={example1}/>


                </Grid>
                <Grid xs={12} style={{paddingTop:20}}>
                    <Copyright />
                </Grid>
            </Grid>
    </Container>
    );
}
