import React from 'react';
import {Cell} from "recharts";
import {compose} from "redux";
import {connect} from "react-redux";

const {PieChart, Pie, Sector} = require("recharts");

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const {
        cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
        fill, payload, percent, value
    } = props;

    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 20) * cos;
    const sy = cy + (outerRadius + 20) * sin;
    const mx = cx + (outerRadius + 20) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (

        <g>

            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>{payload.name}</text>

            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />

            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />

            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${value}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>

        </g>
    );
};
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];


class Level extends React.Component {

    constructor(props) {
        super(props);

        this.state = {

            activeIndex: 0,
            freeValue: 0,
            address: '',
            data: []
        }
    }

    async componentWillReceiveProps(nextProps, nextContext) {


        if (this.props.type === "bandwidth") {

            let newData = [{name: 'Tron Power', value: await nextProps.tronPower.freeNetRemaining},

                {name: 'BandWidth', value: await nextProps.tronPower.energyRemaining},

                {
                    name: 'Energy',
                    value: await nextProps.accountResource.frozen_balance_for_energy.frozen_balance / 1000000
                }
            ];


            await this.setState({data: newData});

        } else if (this.props.type === "tokens") {


        }
        this.onPieEnter(this.state.data, this.state.activeIndex);

    }


    async shouldComponentUpdate(nextProps, nextState, nextContext) {


        return true;

    }


    onPieEnter = (data, index) => {

        this.setState({
            activeIndex: index,
        });


    };


    render() {

        const {data} = this.state;

        return (

            <React.Fragment>

                <PieChart width={900} height={300}>

                    <Pie
                        dataKey="value"
                        activeIndex={this.state.activeIndex}
                        activeShape={renderActiveShape}
                        data={data}
                        cx={200}
                        cy={110}
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={10}

                        onMouseEnter={this.onPieEnter}>

                        {
                            data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)
                        }

                    </Pie>

                </PieChart>



            </React.Fragment>
        );
    }


}

function mapStateToProps(state) {


    return {

        balancesReducer: state.balancesReducer.walletBalances,

    };
}

export default compose(
    connect(mapStateToProps)
)(Level);

