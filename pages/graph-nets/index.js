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
import YouTubeVid from '../../src/YouTubeVid';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

const setup = `using GraphNets

X_DE = 10 # Input feature dimension of edges
X_DN = 5 # Input feature dimension of nodes
X_DG = 0 # Input feature dimension of graphs (no graph level input data)
Y_DE = 3 # Output feature dimension of edges
Y_DN = 4 # Output feature dimension of nodes
Y_DG = 5 # Output feature dimension of graphs

block = GNBlock(
    (X_DE,X_DN,X_DG) => (Y_DE,Y_DN,Y_DG)
)
`;

const example1 = `adj_mat = [
    1 0 1;
    1 1 0;
    0 0 1;
] # Adjacency matrix

num_nodes = size(adj_mat, 1)
num_edges = length(filter(isone, adj_mat))

batch_size = 2
edge_features = rand(Float32, X_DE, num_edges, batch_size)
node_features = rand(Float32, X_DN, num_nodes, batch_size)
graph_features = nothing # no graph level input features

x = (
    graphs=adj_mat, # All graphs in this batch have same structure
    ef=edge_features, # (X_DE, num_edges, batch_size)
    nf=node_features, # (X_DN, num_nodes, batch_size)
    gf=graph_features # (X_DG, batch_size)
) |> batch

y = block(x) |> unbatch

@assert size(y.ef) == (Y_DE, num_edges, batch_size)
@assert size(y.nf) == (Y_DN, num_nodes, batch_size)
@assert size(y.gf) == (Y_DG, batch_size)

# Get the output graph edges of the 1st graph
@assert size(y.ef[:,:,1]) == (Y_DE, num_edges)

# Get the output node edges of the 1st graph
@assert size(y.nf[:,:,1]) == (Y_DN, num_nodes)

# Get the output graph edges of the 2nd graph
@assert size(y.gf[:,2]) == (Y_DG,)
`;

const example2 = `adj_mat_1 = [
    1 0 1;
    1 1 0;
    0 0 1;
] # Adjacency matrix 1
num_nodes_1 = size(adj_mat_1, 1)
num_edges_1 = length(filter(isone, adj_mat_1))

adj_mat_2 = [
    1 0 1 0;
    1 1 0 1;
    0 0 1 0;
    1 1 0 1;
] # Adjacency matrix 2
num_nodes_2 = size(adj_mat_2, 1)
num_edges_2 = length(filter(isone, adj_mat_2))

edge_features = [
    rand(Float32, X_DE, num_edges_1),
    rand(Float32, X_DE, num_edges_2),
]
node_features = [
    rand(Float32, X_DN, num_nodes_1),
    rand(Float32, X_DN, num_nodes_2),
]
graph_features = nothing # no graph level input features

x = (
    graphs=[adj_mat_1,adj_mat_2],  # Graphs in this batch have different structure
    ef=edge_features, 
    nf=node_features,
    gf=graph_features
) |> batch

y_batched = block(x)
y = y_batched |> unbatch

# Memory-efficient view of features for a batch with different graph structures
@assert size(efview(y_batched, :, :, 1)) == (Y_DE, num_edges_1) # edge features for graph 1
@assert size(nfview(y_batched, :, :, 1)) == (Y_DN, num_nodes_1)  # edge features for graph 1
@assert size(gfview(y_batched, :, 1)) == (Y_DG,) # graph features for graph 1
@assert size(efview(y_batched, :, :, 2)) == (Y_DE, num_edges_2) # edge features for graph 2
@assert size(nfview(y_batched, :, :, 2)) == (Y_DN, num_nodes_2) # node features for graph 2
@assert size(gfview(y_batched, :, 2)) == (Y_DG,) # graph features for graph 2

# Copied array of features (less efficient) for a batch with different graph structures
@assert size(y.ef[1]) == (Y_DE, num_edges_1) # edge features for graph 1
@assert size(y.nf[1]) == (Y_DN, num_nodes_1)  # edge features for graph 1
@assert size(y.gf[1]) == (Y_DG,) # graph features for graph 1
@assert size(y.ef[2]) == (Y_DE, num_edges_2) # edge features for graph 2
@assert size(y.nf[2]) == (Y_DN, num_nodes_2) # node features for graph 2
@assert size(y.gf[2]) == (Y_DG,) # graph features for graph 2
`;

const example3 = `input_dims = (X_DE, X_DN, X_DG)
core_dims = (10, 5, 3)
output_dims = (Y_DE, Y_DN, Y_DG)

struct GNNModel{E,C,D}
    encoder::E
    core_list::C
    decoder::D
end

function GNNModel(; n_cores=2)
    GNNModel(
        GNBlock(input_dims => core_dims),
        GNCoreList([GNCore(core_dims) for _ in 1:n_cores]),
        GNBlock(core_dims => output_dims),
    )
end

function (m::GNNModel)(x)
    (m.decoder ∘ m.core_list ∘ m.encoder)(x)
end

m = GNNModel()

adj_mat = [
    1 0 1;
    1 1 0;
    0 0 1;
]

num_nodes = size(adj_mat, 1)
num_edges = length(filter(isone, adj_mat))

batch_size = 2
edge_features = rand(Float32, X_DE, num_edges, batch_size)
node_features = rand(Float32, X_DN, num_nodes, batch_size)
graph_features = nothing # no graph level input features

x = (
    graphs=adj_mat, # All graphs in this batch have same structure
    ef=edge_features, # (X_DE, num_edges, batch_size)
    nf=node_features, # (X_DN, num_nodes, batch_size)
    gf=graph_features # (X_DG, batch_size)
) |> batch

y = block(x) |> unbatch

@assert size(y.ef) == (Y_DE, num_edges, batch_size)
@assert size(y.nf) == (Y_DN, num_nodes, batch_size)
@assert size(y.gf) == (Y_DG, batch_size)
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
                        Package: GraphNets.jl
                    </Typography>
                    <Typography color="text.secondary">
                        <Link href="https://github.com/JuliaMLTools/GraphNets.jl">Source on GitHub</Link>
                    </Typography>
                    <Typography color="text.secondary">
                        <Link href="https://juliamltools.github.io/GraphNets.jl">API Docs</Link>
                    </Typography>

                    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary">
                        GraphNets.jl is a Julia implementation of DeepMind's <Link href="https://github.com/deepmind/graph_nets">Graph Nets</Link> and the paper <Link href="https://arxiv.org/abs/1806.01261">Relational inductive biases, deep learning, and graph networks</Link>.
                    </Typography>

                    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary">
                    Petar Veličković gives a fantastic explanation of the Graph Nets architecture and graph neural networks in general in the lecture below.
                    </Typography>

                    <YouTubeVid width="100%" height="500" videoId="i79ewWQiUX4" />

                    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary" variant="h5">
                        Setup
                    </Typography>
                    <CodeBlock code={setup}/>
                    
                    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary" variant="h5">
                        Example 1: Batch of graphs with same structure (same adjacency matrix)
                    </Typography>
                    <CodeBlock code={example1}/>
                    
                    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary" variant="h5">
                        Example 2: Batch of graphs with different structures
                    </Typography>
                    <CodeBlock code={example2}/>
                    
                    <Typography sx={{ mt: 6, mb: 3 }} color="text.secondary" variant="h5">
                        Example 3: Encoder -&gt; Core -&gt; Decoder (sequential blocks)
                    </Typography>
                    <CodeBlock code={example3}/>

                </Grid>
                <Grid xs={12} style={{paddingTop:20}}>
                    <Copyright />
                </Grid>
            </Grid>
    </Container>
    );
}
