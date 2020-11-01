import React, { Component, createRef, Ref } from 'react';
import * as d3 from 'd3';
class E1rmTrend extends Component {
  private canvas: React.RefObject<HTMLInputElement>;
  constructor(props) {
    super(props);
    this.canvas = createRef();
  }
  componentDidMount() {
    const data = [2, 4, 2, 6, 8];
    this.drawBarChart(data);
  }
  drawBarChart(data: number[]) {
    const svg = d3
      .select(this.canvas.current)
      .append('svg')
      .attr('width', 600)
      .attr('height', 400)
      .style('border', '1px solid black');

    svg
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('width', 40)
      .attr('height', d => d * 20)
      .attr('fill', 'orange');
  }
  render() {
    return <div ref={this.canvas}></div>;
  }
}
export default E1rmTrend;
