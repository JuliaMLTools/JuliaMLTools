import * as React from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ProTip from '../../src/ProTip';
import Link from '../../src/Link';
import Copyright from '../../src/Copyright.js';
import NestedList from '../../src/NestedList';
import { Card, Chip, Divider } from '@mui/material';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import CodeBlock from '../transformer-blocks/code';
import CodeTabs from '../shakespeare-gpt/code_tabs';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const example1 = ``;

const code2 = `using TransformerBlocks
using CUDA
using Flux
using Functors
using Random
using LinearAlgebra
using Distributions
using ProgressMeter`;

const code3 = `[deps]
CUDA = "052768ef-5323-5732-b1bb-66c8b64840ba"
Distributions = "31c24e10-a181-5473-b8eb-7969acd0382f"
Flux = "587475ba-b771-5e3f-ad9e-33799f191a9c"
Functors = "d9f16b24-f501-4c13-a1f2-28368ffc5196"
ProgressMeter = "92933f4c-e287-5a05-a399-4b506db050ca"
TransformerBlocks = "5cc1ab4e-60b8-441f-a6b4-07f482118326"`;

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
                        Example: Graph Sort
                    </Typography>
                    
                    <Typography color="text.secondary">
                        TAGS  
                        <Chip label="GraphNets.jl" style={{cursor:"pointer",marginLeft:6}} variant="outlined" size="small" component="a" href="/graphnets" /> 
                        <Chip label="GNNs" style={{cursor:"pointer",marginLeft:6}} variant="outlined" size="small" /> 
                    </Typography>

                    <Typography color="text.secondary" style={{marginTop:10,marginBottom:10}}>
                        <Link href="https://github.com/JuliaMLTools/TransformerBlocks.jl/tree/main/examples/shakespeare">Source on GitHub</Link>
                    </Typography>
                    
                    <Divider style={{marginTop:30,marginBottom:30}} />

                    <Typography sx={{ mb: 3 }} color="text.secondary">
                    This is a toy example demonstrating a GNN that accepts a graph with node features and outputs a graph with node and edge features indicating an ordering of the graph nodes.
                    </Typography>

                    <img src="gnn.svg" style={{width:"100%"}} /> 
                    
                    <br/><br/><br/>

                    <Typography sx={{ mb: 3 }} color="text.secondary">
                    Below is a matrix input/output visualization of such a function.
                    </Typography>
                    
                    <img src="gnn-matrix.png" style={{width:"100%"}} /> 

                    <CodeTabs 
                        tabs={[
                            {title:"sort.jl", code:<CodeBlock code={example1} customStyle={{margin:0, padding:0}} />},
                            {title:"imports.jl", code:<CodeBlock code={code2} customStyle={{margin:0, padding:0}}/>},
                            {title:"Project.toml", code:<CodeBlock code={code3} customStyle={{margin:0, padding:0}}/>}
                        ]} 
                    />


                </Grid>
                <Grid xs={12} style={{paddingTop:40}}>
                    <Copyright />
                </Grid>
            </Grid>
    </Container>
    );
}
