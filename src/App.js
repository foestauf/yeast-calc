import React, {useEffect, useReducer, useState} from "react";
import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav"

const initialState = {
  fermVol: 10,
  dillution: 200,
  cellConc: 1.0,
  densSlurry: 1.1,
  numSquares: 25
}

const yeastReducer = (state, action) => {
  switch (action.type) {
    case 'FERMVOL':
      return {...state, fermVol: action.payload};
    case 'GRAVITY':
      return {...state, gravity: action.payload};
    case 'CELLCONC':
      return {...state, cellConc: action.payload};
    case 'DENSSLURRY':
      return {...state, densSlurry: action.payload};
    case 'NUMSQUARES':
      return {...state, numSquares: action.payload};
    case 'DILLUTION':
      return {...state, dillution: action.payload};
    case 'LIVECELLS':
      return {...state, liveCells: action.payload}
    case 'DEADCELLS':
      return {...state, deadCells: action.payload}
    default:
      throw new Error('WTF OVER')
  }
}

const YeastCalculator = () => {
  const [state, dispatch] = useReducer(yeastReducer, initialState);
  const [output, setOutput] = useState({});
  function calc() {
    let cellsCounted = (state.liveCells + state.deadCells)
    let viability = (state.liveCells / cellsCounted * 100).toFixed(2)
    let squares = 25 / state.numSquares
    let fermVolML = (state.fermVol * 31) * 3785.41;
    let cellsPerML = cellsCounted * squares * state.dillution * Math.pow(10,4)
    let cellConcPerMLPerP = (state.cellConc * Math.pow(10,6))
    let totalCellsPitch = state.fermVol * 117180 * state.gravity * Math.pow(10, 5)
    let volNeededML = totalCellsPitch / cellsPerML
    let volNeededLiter = volNeededML / 1000
    let volNeededGal = volNeededLiter * 0.264172
    let massNeededGram = volNeededML / state.densSlurry
    let massNeededKG = massNeededGram / 1000
    let massNeededLB = massNeededKG * 2.20462
    setOutput({...output,
      viability: viability,
      cellsCounted: cellsCounted,
      cellsML: cellsPerML.toExponential(2),
      fermGal: state.fermVol * 31,
      fermML: fermVolML.toExponential(2),
      cellConcPerMLPerP: cellConcPerMLPerP.toExponential(2),
      cellConcML: (cellConcPerMLPerP * state.gravity).toExponential(2),
      totalCellsPitch: totalCellsPitch.toExponential(2),
      volNeededML: volNeededML.toExponential((2)),
      volNeededLiter: volNeededLiter.toFixed(2),
      volNeededGal: volNeededGal.toFixed(2),
      massNeededGram: massNeededGram.toExponential(2),
      massNeededKG: massNeededKG.toFixed(2),
      massNeededLB: massNeededLB.toFixed(2)
    })
  }
  useEffect(calc,[state]);
  return (
      <Container style={{marginTop: "30px"}} id="yeast-calc">
        <h3>Yeast Slurry Pitch Calculator</h3>
        <p>Use the table below while performing yeast cell counts of your slurry before pitch.
        </p>
        <Row>
          <Col className="input">Yellow Cells are inputs</Col>
          <Col className="output">Blue Cells are calculated</Col>
        </Row>
        <Row>
          <Col className="leftAnchor-col">
            <Row className="topRow">Fermentation Volume (in BBL)</Row>
            <Row className="input btmCol">
              <Form.Control placeholder={state.fermVol}
                            onChange={e => dispatch({
                              type: 'FERMVOL',
                              payload: Number(e.target.value)
                            })} size="sm" type="text"/></Row>
          </Col>
          <Col>This is size of equipment</Col>
          <InfoCell title="Cell Count (Cells/ML)" value={output.cellsML}/>
          <InfoCell title="Fermentation Volume (gal)" value={output.fermGal}/>
          <InfoCell title="Fermentation Volume (mL)" value={output.fermML}/>
          <InfoCell title="Desired Cell Concentration (Cells/mL-P)" value={output.cellConcPerMLPerP}/>
          <InfoCell title="Desired Cell Concentration (Cells/mL)" value={output.cellConcML}/>
          <InfoCell title="Total # Cells for Pitch" value={output.totalCellsPitch}/>
        </Row>
        <Row>
          <Col className="leftAnchor-col">
            <Row className="topRow">Desired Gravity</Row>
            <Row className="input">
              <Form.Control onChange={e => dispatch({
                type: 'GRAVITY',
                payload: Number(e.target.value)
              })} size="sm"
                            type="text"/></Row>
          </Col>
          <Col>This is the expected gravity of the beer being pitched into</Col>
          <InfoCell title="Volume of Slurry Needed (mL)" value={output.volNeededML}/>
          <InfoCell title="Volume of Slurry needed (L)" value={output.volNeededLiter}/>
          <InfoCell title="Volume of Slurry Needed (Gal)" value={output.volNeededGal}/>
          <InfoCell title="Mass of slurry Needed(g)" value={output.massNeededGram}/>
          <InfoCell title="Mass of slurry needed (KG)" value={output.massNeededKG}/>
          <InfoCell title="Mass of slurry needed (lb)" value={output.massNeededLB}/>
        </Row>
        <Row>
          <Col className="leftAnchor-col">
            <Row className="topRow">Desired Cell concentration (Cells/mL x 1E6)</Row>
            <Row className="input">
              <Form.Control placeholder={state.cellConc}
                            onChange={e => dispatch({
                                  type: 'CELLCONC',
                                  payload: Number(e.target.value)
                                }
                            )} size="sm"
                            type="text"/></Row>
          </Col>
          <Col>This is the desired concentration of cells/mL</Col>
          <Col className="leftAnchor-col" md={9}>
            <Row className="topRow"></Row>
            <Row style={{display: "inline"}}>Hemocytometer cell count</Row>
          </Col>
        </Row>
        <Row>
          <Col className="leftAnchor-col">
            <Row className="topRow">Density of Slurry (g/mL)</Row>
            <Row className="input">
              <Form.Control placeholder={state.densSlurry}
                            onChange={e => dispatch({
                              type: 'DENSSLURRY',
                              payload: Number(e.target.value)
                            })} size="sm"
                            type="text"/></Row>
          </Col>
          <Col>
            <Row>This is the density of the slury being pitched. This can be measured of if unknown go with
              1.1g/mL</Row>
          </Col>
          <InfoCell title="Total Cells Counted" value={output.cellsCounted}/>
          <Col>
            <Row className="topRow"># of Squares Counted</Row>
            <Row className="input">
              <Form.Control placeholder={state.numSquares} onChange={e => dispatch({
                type: 'NUMSQUARES',
                payload: Number(e.target.value)
              })} size="sm"
                            type="text"/></Row>
          </Col>
          <Col>
            <Row className="topRow">Dilution</Row>
            <Row className="input">
              <Form.Control placeholder={state.dillution}
                            onChange={e => dispatch({
                              type: 'DILLUTION',
                              payload: Number(e.target.value)
                            })} size="sm"
                            type="text"/></Row>
          </Col>
          <Col>
            <Row className="topRow">Live Cells Counted</Row>
            <Row className="input">
              <Form.Control placeholder={state.liveCells}
                            onChange={e => dispatch({
                              type: 'LIVECELLS',
                              payload: Number(e.target.value)
                            })} size="sm"
                            type="text"/></Row>
          </Col>
          <Col>
            <Row className="topRow">Dead Cells Counted</Row>
            <Row className="input">
              <Form.Control placeholder={state.deadCells}
                            onChange={e => dispatch({
                              type: 'DEADCELLS',
                              payload: Number(e.target.value)
                            })} size="sm"
                            type="text"/></Row>
          </Col>
          <InfoCell title="% Viability (Do not pitch under 90%)" value={output.viability}/>
        </Row>
        <span>Feel free to contribute</span>
              <Nav.Link href="https://www.github.com/foestauf/yeast-calc">Github</Nav.Link>
      </Container>
  )
}

const InfoCell = (props) => {
  function isNaN(number) {
      if (number == null) return
    if (number >= 0) {
      return number
    } else {
      return '-'
    }
  }
  return (
      <Col>
        <Row className="topRow">{props.title}</Row>
        <Row className="output">
          <Form.Control size="sm" type="text" readOnly placeholder="-"
                        value={isNaN(props.value)}/></Row>
      </Col>
  )
}

export default YeastCalculator;