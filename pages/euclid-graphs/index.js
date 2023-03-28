import * as React from 'react';
import { styled } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Link from '../../src/Link';
import Copyright from '../../src/Copyright.js';
import NestedList from '../../src/NestedList';
import { Card } from '@mui/material';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import CodeBlock from '../transformer-blocks/code';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const example1 = `using EuclidGraphs
nodes = [(0,-10),(0,70),(75,21),(49,-70),(-49,-70),(-75,21)]
g1 = EuclidGraph(nodes, adj_mat=rand(0:1, 6, 6))
g1() # Renders in VSCode
write("basic.svg", g1())
`;

const example2 = `g2 = EuclidGraph(
    [(0,-10),(0,70),(75,21),(49,-70),(-49,-70),(-75,21)], 
    adj_mat=rand(0:1, 6, 6),
    node_style=(node) -> NodeStyle(
        inner_fill=(isone(node.features[node.idx]) ? "green" : "#ccc"),
        font_color="white",
        stroke=(iseven(node.idx) ? "blue" : "#333"),
        value=(node) -> nothing,
    ),
    edge_style=(edge) -> EdgeStyle(
        directed_stroke=edge.features[edge.idx],
        arrow_color=edge.features[edge.idx],
        undirected_stroke="#ccc",
    ),
)
num_edges = length(filter(isone, g2.adj_mat))
num_nodes = size(g2.adj_mat, 1)
node_features = zeros(Int, num_nodes)
node_features[rand(1:num_nodes)] = 1
edge_features = rand(["red", "#273E5B", "#273E5B", "#9493F2"], num_edges)
g2(node_features, edge_features) # Renders in VSCode
write("styled.svg", g2(node_features, edge_features))
`;

const example3 = `logo = EuclidGraph(
    [(-50,0),(0,75),(0,25),(0,-25),(0,-75),(50, 25),(50,-25)], 
    node_style=(node) -> NodeStyle(
        inner_fill=node.features[node.idx],
        value=nothing,
    ),
    edge_style=(edge) -> EdgeStyle(stroke="#ccc"),
    fully_connected=false,
)
addbiedges!(logo, [(1,3),(1,2),(1,5),(1,4),(2,6),(5,7),(4,6),(3,7)])
node_features = ["#4162D9","#389825","#9558B2","#9558B2","#389825","#CB3C33","#CB3C33"]
logo(node_features) # Renders in VSCode
write("logo.svg", logo(node_features))
`;

const example4 = `shapes = [pole triangle square; pentagon hexagon heptagon; octagon nonagon decagon]
svgs = [g(; svg_width=200, svg_height=200) for g in EuclidGraph.(shapes; fully_connected=true)]
grid = SVG(svgs)
write("grid.svg", grid)
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
                        Package: EuclidGraphs.jl
                    </Typography>
                    <Typography color="text.secondary">
                        <Link href="https://github.com/JuliaMLTools/EuclidGraphs.jl">Source on GitHub</Link>
                    </Typography>
                    <Typography color="text.secondary">
                        <Link href="https://juliamltools.github.io/EuclidGraphs.jl">API Docs</Link>
                    </Typography>
                    
                    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary">
                        Simple, lightweight, beautiful graph rendering in VSCode and SVG.  Designed to quickly visualize input and output features for graph neural networks (such as <Link href="https://github.com/JuliaMLTools/GraphNets.jl">GraphNets.jl</Link>).
                    </Typography>
                    
                    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary" variant="h5">
                        Example 1: Basic graph
                    </Typography>
                    <CodeBlock code={example1}/>
                    <p align="center">
                        <img width="400px" src="https://raw.githubusercontent.com/JuliaMLTools/EuclidGraphs.jl/main/docs/src/assets/basic.svg"/>
                    </p>
                    
                    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary" variant="h5">
                        Example 2: Styled graph
                    </Typography>
                    <CodeBlock code={example2}/>
                    <p align="center">
                        <img width="400px" src="https://raw.githubusercontent.com/JuliaMLTools/EuclidGraphs.jl/main/docs/src/assets/styled.svg"/>
                    </p>
                    
                    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary" variant="h5">
                        Example 3: The EuclidGraphs.jl logo
                    </Typography>
                    <CodeBlock code={example3}/>
                    <p align="center">
                        <img width="400px" src="https://raw.githubusercontent.com/JuliaMLTools/EuclidGraphs.jl/main/docs/src/assets/logo.svg"/>
                    </p>
                    
                    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary" variant="h5">
                        Example 4: Shapes
                    </Typography>
                    <CodeBlock code={example4}/>
                    <p align="center">
                        <img width="600px" src="https://raw.githubusercontent.com/JuliaMLTools/EuclidGraphs.jl/main/docs/src/assets/grid.svg"/>
                    </p>

                </Grid>
                <Grid xs={12} style={{paddingTop:20}}>
                    <Copyright />
                </Grid>
            </Grid>
    </Container>
    );
}
