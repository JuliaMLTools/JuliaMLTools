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

const sortjl = `using GraphNets
include("imports.jl")
Random.seed!(1234)

##########################
# Create a sample graph with input/output features
##########################
vocab_size = 100 # Maximum integer to be sorted

function gensample()
    n = rand(2:10) # number of nodes
    adj_mat = ones(Int, n, n) # fully connected graph
    num_edges = length(filter(isone, adj_mat))
    x_nf = rand(1:100, n) # Sample input node features
    y_nf = Int.(x_nf .== minimum(x_nf)) # Sample output node features
    y_ef = getedgetargets(x_nf) # Output edge features
    (
        adj_mat=adj_mat, 
        x=(; nf=Flux.onehotbatch(x_nf, 1:vocab_size)),
        y=(nf=Flux.onehotbatch(y_nf, 0:1), ef=Flux.onehotbatch(y_ef, 0:1))
    )
end

###########################
# Training batch generator
###########################
device = CUDA.functional() ? gpu : cpu

function getbatch(batch_size)
    samples = [gensample() for _ in 1:batch_size]
    x = (
        graphs=[s.adj_mat for s in samples],
        ef=nothing, 
        nf=[s.x.nf for s in samples],
        gf=nothing
    ) |> batch |> device
    target = (
        graphs=[s.adj_mat for s in samples],
        ef=[s.y.ef for s in samples],
        nf=[s.y.nf for s in samples],
        gf=nothing,
    ) |> batch |> device
    x, target
end

##########################
# Define the GraphNet GNN
##########################
struct GNModel
    encoder
    core
    decoder
end

Functors.@functor GNModel

function GNModel(from_to::Pair, core_dims; n_core_blocks=2)
    x_dims, y_dims = from_to
    _, x_dn, _ = x_dims
    GNModel(
        GNBlock(x_dims => core_dims),
        GNCoreList([GNCore(core_dims) for _ in 1:n_core_blocks]),
        GNBlock(core_dims => y_dims),
    )
end

function (m::GNModel)(xs, targets=nothing)
    encoded = m.encoder(xs)
    x1 = m.core(encoded)
    ŷ = m.decoder(x1)
    if isnothing(targets)
        loss = nothing
    else
        loss_nodes = Flux.logitcrossentropy(flatunpaddednf(ŷ), flatunpaddednf(targets))
        loss_edges = Flux.logitcrossentropy(flatunpaddedef(ŷ), flatunpaddedef(targets))
        loss = loss_nodes + loss_edges
    end
    (graph=ŷ, loss=loss)
end

##########################
# Init untrained model
##########################
x_dims = (0,vocab_size,0)
core_dims = (384,384,384)
y_dims = (2,2,0)
model = GNModel(x_dims=>y_dims, core_dims) |> device

##########################
# Ensure model runs on a batch
##########################
x, y = getbatch(2)
y_batched, loss = model(x,y)

##########################
# Show a training sample and the output
##########################
function showsample(model)
    cpu_model = model |> cpu
    x, y = getbatch(1) .|> cpu
    ŷ_batched, loss = cpu_model(x, y)
    ŷ = ŷ_batched |> unbatch
    x = SVG([SVGText("X"), getinputgraph(x)])
    y = SVG([SVGText("Y"), gettargetgraph(y)])
    ŷ = SVG([SVGText("Ŷ"), gettargetgraph(ŷ)])
    SVG([x,y,ŷ], dims=2)
end

showsample(model)

##########################
# Setup hyperparameters and train
##########################
batch_size = 4
learning_rate = 3e-4
optim = Flux.setup(Flux.AdamW(learning_rate), model)
dropout = 0
max_iters = 20_000

function train!(model)
    trainmode!(model)
    @showprogress for iter in 1:max_iters
        xb, yb = getbatch(batch_size)
        loss, grads = Flux.withgradient(model) do m
            m(xb, yb).loss
        end
        Flux.update!(optim, model, grads[1])
    end
    testmode!(model)
end

train!(model)

##########################
# Check results
##########################
showsample(model)`;

const importsjl = `using Functors
using Flux
using SparseArrays
using CUDA
using Random
using ProgressMeter
using EuclidGraphs
include("helper.jl")
include("viz.jl")`;

const projecttoml = `[deps]
CUDA = "052768ef-5323-5732-b1bb-66c8b64840ba"
EuclidGraphs = "6d00f6e2-8806-480a-ab08-d5e107e6bfed"
Flux = "587475ba-b771-5e3f-ad9e-33799f191a9c"
Functors = "d9f16b24-f501-4c13-a1f2-28368ffc5196"
GraphNets = "9052fb24-8e06-4531-a321-89bd3c4584f9"
ProgressMeter = "92933f4c-e287-5a05-a399-4b506db050ca"
Random = "9a3f8284-a2c9-5f02-9a11-845980a1fd5c"`;

const helperjl = `function getedgetargets(nodes)
    n = length(nodes)
    nodes_idx = collect(zip(1:n, nodes))
    sorted = first.(sort(nodes_idx; lt=(a,b)->last(a) < last(b)))
    enabled_edges = collect(zip(sorted[1:end-1], sorted[2:end]))
    edge_targets_mat = zeros(Int, n, n)
    for (i,j) in enabled_edges
        edge_targets_mat[i,j] = 1
    end
    edge_targets = edge_targets_mat[:]
    edge_targets
end`;

const vizjl = `function getinputgraph(x)
    nodes = Flux.onecold(x.nf)
    n = length(nodes)
    g = EuclidGraph(
        ngon(length(nodes)),
        fully_connected=true, 
        node_style=(node) -> NodeStyle(
            value=(node) -> node.features[node.idx],
        ),
    )
    g(nodes)
end

function gettargetgraph(y)
    nodes = Flux.onecold(y.nf, 0:1)
    edges = Flux.onecold(y.ef, 0:1)
    n = length(nodes)
    g = EuclidGraph(
        ngon(n),
        adj_mat=reshape(edges, n, n),
        node_style=(node) -> NodeStyle(
            stroke="#ccc",
            inner_fill=(isone(node.features[node.idx]) ? "green" : "#fff"),
            value=(node) -> nothing
        ),
        edge_style=(edge) -> EdgeStyle(
            stroke="green",
        )
    )
    g(nodes, edges)
end`;

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
                        <Chip label="GraphNets.jl" style={{cursor:"pointer",marginLeft:6}} variant="outlined" size="small" component="a" href="/graph-nets" /> 
                        <Chip label="EuclidGraphs.jl" style={{cursor:"pointer",marginLeft:6}} variant="outlined" size="small" component="a" href="/euclid-graphs" /> 
                    </Typography>

                    <Typography color="text.secondary" style={{marginTop:10,marginBottom:10}}>
                        <Link href="https://github.com/JuliaMLTools/GraphNets.jl/tree/main/examples/sort">Source on GitHub</Link>
                    </Typography>
                    
                    <Divider style={{marginTop:30,marginBottom:30}} />

                    <Typography sx={{ mb: 3 }} color="text.secondary">
                    This example demonstrates a GNN that accepts a graph with node features and outputs a graph with node and edge features indicating an ordering of the graph nodes.
                    </Typography>

                    <img src="gnn.svg" style={{width:"100%"}} /> 
                    
                    <br/><br/><br/>

                    <Typography sx={{ mb: 3 }} color="text.secondary">
                    Below is a matrix input/output visualization of such a function.
                    </Typography>
                    
                    <img src="gnn-matrix.png" style={{width:"100%"}} /> 

                    <CodeTabs 
                        tabs={[
                            {title:"sort.jl", code:<CodeBlock code={sortjl} customStyle={{margin:0, padding:0}} />},
                            {title:"imports.jl", code:<CodeBlock code={importsjl} customStyle={{margin:0, padding:0}}/>},
                            {title:"Project.toml", code:<CodeBlock code={projecttoml} customStyle={{margin:0, padding:0}}/>},
                            {title:"viz.jl", code:<CodeBlock code={vizjl} customStyle={{margin:0, padding:0}}/>},
                            {title:"helper.jl", code:<CodeBlock code={helperjl} customStyle={{margin:0, padding:0}}/>}
                        ]} 
                    />

                    <br/><br/>

                    <Typography sx={{ mb: 3 }} color="text.secondary">
                    Sample input/target/output:
                    </Typography>
                
                    <img src="graph-sort.svg" style={{width:"100%"}} /> 


                </Grid>
                <Grid xs={12} style={{paddingTop:40}}>
                    <Copyright />
                </Grid>
            </Grid>
    </Container>
    );
}
