import { Row, Card, Col } from 'antd';  
import imgdesayuno from "../Img/imgdesayuno.png";
import defRec from "../Img/defRec.png";
import btEditar from "../Img/btEditar.png";
import btCompartir from "../Img/btCompartir.png";
import imgCal from "../Img/imgCal.png";
import btEliminar from "../Img/btEliminar.png";
import relojarena from "../Img/relojarena.png";
import cuadros from "../Img/cuadros.png";
import flechaizquierda from "../Img/flechaizquierda.png";
import flechaderecha from "../Img/flechaderecha.png";
import calendario from "../Img/calendario.png";
import btagregar from "../Img/btagregar.png";

export default function Inicio() {  
  return (  
    <>  
      <div style={{ marginLeft: '15px', marginRight: '15px',}}>
        <div style={{height: 'Auto', justifyContent: 'space-between', display: 'flex',}}>
          <div style={{height: '100%', display: 'flex',}}>
            <img src={imgdesayuno} style={{height: '100px',}}/><img src={relojarena} style={{height: '66px',}}/>  
          </div>
          <div style={{height: '100%', display: 'flex', paddingLeft: '0'}}>
            <img src={cuadros} style={{height: '58px',}}/>
          </div>
        </div>
        <div style={{backgroundColor: '#D3E2B4', height: 'auto', borderRadius: '10px',}}>
          <div style={{margin: '10px', marginTop: '5px', alignItems: 'center', display: 'flex',}}>
            <div style={{height: '100%', display: 'flex',}}>
              <img src={flechaizquierda} style={{height: '40px',}}/>
              <a style={{fontFamily: 'Jomhuria', fontSize: '32px', color: '#86A071',}}>Semana del 1 al 18 de noviembre</a> 
              <img src={calendario} style={{height: '30px',}}/><img src={btCompartir} style={{height: '30.5px',}}/>
            </div>
            <div style={{height: '100%', display: 'flex', paddingLeft: '0',}} >
              <img src={flechaderecha} style={{height: '40px',}}/>
            </div>
          </div>
        </div>
        <br />
        <div style={{backgroundColor: '#D3E2B4', height: '45px', borderRadius: '10px',}}>
          <div style={{margin: '10px', marginTop: '5px',}}>
            <a style={{fontFamily: 'Jomhuria', fontSize: '32px', color: '#86A071',}}>Jueves 10 de nobiembre 2024</a>      
          </div>
        </div>
        <br /><br />
        <div style={{backgroundColor: '#D3E2B4', borderRadius: '8px', paddingRight: '15px', paddingLeft: '15px', paddingBottom: '10px'}}><a style={{fontFamily: 'Jomhuria', fontSize: '45px', color: '#86A071',}}>Desayuno</a>
          <div style={{margin: '40px', marginBottom: '20px',}}>
            <Row gutter={40}>  
              <Col xs={24} sm={16} md={8} lg={6}>  
                <Card style={{ backgroundColor: '#CAE2B5', border: '1px solid #ccc', padding: '8px', }}>  
                  <div style={{ height: 'Auto', width: 'Auto', display: 'flex', justifyContent: 'center', alignSelf: 'center', borderColor: 'Black',}}>  
                    <img src={defRec} style={{width: '160px',}}/>  <br />
                  </div>  
                  <Row>  
                    <Col xs={18} sm={18} md={18} lg={18}>  
                      <div> 
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>Plato 5 / 10 porciones  </a> <img src={btEditar} style={{height: '12.8px',}}/>
                      </div>  
                      <div>  
                        <img src={imgCal} style={{height: '13px',}}/>  
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>  Energía: 0.5 cal  </a>
                        <img src={btCompartir}style={{height: '16px',}}/>  
                      </div>  
                    </Col>  
                    <Col xs={6} sm={6} md={6} lg={6}>  
                      <div>  
                        <img src={btEliminar} style={{height: '15px', marginTop: '10px',}}/>  
                      </div>  
                    </Col>  
                  </Row>  
                </Card>  
              </Col>  
              <Col xs={24} sm={16} md={8} lg={6}>  
                <Card style={{ backgroundColor: '#CAE2B5', border: '1px solid #ccc', padding: '8px', }}>  
                  <div style={{ height: 'Auto', width: 'Auto', display: 'flex', justifyContent: 'center', alignSelf: 'center', borderColor: 'Black',}}>  
                    <img src={defRec} style={{width: '160px',}}/>  <br />
                  </div>  
                  <Row>  
                    <Col xs={18} sm={18} md={18} lg={18}>  
                      <div> 
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>Plato 5 / 10 porciones  </a> <img src={btEditar} style={{height: '12.8px',}}/>
                      </div>  
                      <div>  
                        <img src={imgCal} style={{height: '13px',}}/>  
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>  Energía: 0.5 cal  </a>
                        <img src={btCompartir}style={{height: '16px',}}/>  
                      </div>  
                    </Col>  
                    <Col xs={6} sm={6} md={6} lg={6}>  
                      <div>  
                        <img src={btEliminar} style={{height: '15px', marginTop: '10px',}}/>  
                      </div>  
                    </Col>  
                  </Row>  
                </Card>  
              </Col>
              <Col xs={24} sm={16} md={8} lg={6}>  
                <Card style={{ backgroundColor: '#CAE2B5', border: '1px solid #ccc', padding: '8px', }}>  
                  <div style={{ height: 'Auto', width: 'Auto', display: 'flex', justifyContent: 'center', alignSelf: 'center', borderColor: 'Black',}}>  
                    <img src={defRec} style={{width: '160px',}}/>  <br />
                  </div>  
                  <Row>  
                    <Col xs={18} sm={18} md={18} lg={18}>  
                      <div> 
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>Plato 5 / 10 porciones  </a> <img src={btEditar} style={{height: '12.8px',}}/>
                      </div>  
                      <div>  
                        <img src={imgCal} style={{height: '13px',}}/>  
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>  Energía: 0.5 cal  </a>
                        <img src={btCompartir}style={{height: '16px',}}/>  
                      </div>  
                    </Col>  
                    <Col xs={6} sm={6} md={6} lg={6}>  
                      <div>  
                        <img src={btEliminar} style={{height: '15px', marginTop: '10px',}}/>  
                      </div>  
                    </Col>  
                  </Row>  
                </Card>  
              </Col>
              <Col xs={24} sm={16} md={8} lg={6}>  
                <Card style={{ backgroundColor: '#CAE2B5', border: '1px solid #ccc', padding: '8px', }}>  
                  <div style={{ height: 'Auto', width: 'Auto', display: 'flex', justifyContent: 'center', alignSelf: 'center', borderColor: 'Black',}}>  
                    <img src={defRec} style={{width: '160px',}}/>  <br />
                  </div>  
                  <Row>  
                    <Col xs={18} sm={18} md={18} lg={18}>  
                      <div> 
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>Plato 5 / 10 porciones  </a> <img src={btEditar} style={{height: '12.8px',}}/>
                      </div>  
                      <div>  
                        <img src={imgCal} style={{height: '13px',}}/>  
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>  Energía: 0.5 cal  </a>
                        <img src={btCompartir}style={{height: '16px',}}/>  
                      </div>  
                    </Col>  
                    <Col xs={6} sm={6} md={6} lg={6}>  
                      <div>  
                        <img src={btEliminar} style={{height: '15px', marginTop: '10px',}}/>  
                      </div>  
                    </Col>  
                  </Row>  
                </Card>  
              </Col>      
            </Row><br/><br/>  
            <Col xs={24} sm={16} md={8} lg={6}>
              <div style={{display: 'flex',}}>
                <img src={btagregar} style={{height: '52px',}}/>
              </div><br/><br/>
            </Col> 
          </div>
        </div>
        <br />
        <div style={{backgroundColor: '#D3E2B4', height: '45px', borderRadius: '10px',}}>
          <div style={{margin: '10px', marginTop: '5px',}}>
            <a style={{fontFamily: 'Jomhuria', fontSize: '32px', color: '#86A071',}}>Jueves 10 de nobiembre 2024</a>      
          </div>
        </div>
        <br />

        <div style={{backgroundColor: '#D3E2B4', borderRadius: '8px', paddingRight: '15px', paddingLeft: '15px', paddingBottom: '10px'}}><a style={{fontFamily: 'Jomhuria', fontSize: '45px', color: '#86A071',}}>Desayuno</a>
          <div style={{margin: '40px', marginBottom: '20px',}}>
          <Row gutter={40}>  
              <Col xs={24} sm={16} md={8} lg={6}>  
                <Card style={{ backgroundColor: '#CAE2B5', border: '1px solid #ccc', padding: '8px', }}>  
                  <div style={{ height: 'Auto', width: 'Auto', display: 'flex', justifyContent: 'center', alignSelf: 'center', borderColor: 'Black',}}>  
                    <img src={defRec} style={{width: '160px',}}/>  <br />
                  </div>  
                  <Row>  
                    <Col xs={18} sm={18} md={18} lg={18}>  
                      <div> 
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>Plato 5 / 10 porciones  </a> <img src={btEditar} style={{height: '12.8px',}}/>
                      </div>  
                      <div>  
                        <img src={imgCal} style={{height: '13px',}}/>  
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>  Energía: 0.5 cal  </a>
                        <img src={btCompartir}style={{height: '16px',}}/>  
                      </div>  
                    </Col>  
                    <Col xs={6} sm={6} md={6} lg={6}>  
                      <div>  
                        <img src={btEliminar} style={{height: '15px', marginTop: '10px',}}/>  
                      </div>  
                    </Col>  
                  </Row>  
                </Card>  
              </Col>  
              <Col xs={24} sm={16} md={8} lg={6}>  
                <Card style={{ backgroundColor: '#CAE2B5', border: '1px solid #ccc', padding: '8px', }}>  
                  <div style={{ height: 'Auto', width: 'Auto', display: 'flex', justifyContent: 'center', alignSelf: 'center', borderColor: 'Black',}}>  
                    <img src={defRec} style={{width: '160px',}}/>  <br />
                  </div>  
                  <Row>  
                    <Col xs={18} sm={18} md={18} lg={18}>  
                      <div> 
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>Plato 5 / 10 porciones  </a> <img src={btEditar} style={{height: '12.8px',}}/>
                      </div>  
                      <div>  
                        <img src={imgCal} style={{height: '13px',}}/>  
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>  Energía: 0.5 cal  </a>
                        <img src={btCompartir}style={{height: '16px',}}/>  
                      </div>  
                    </Col>  
                    <Col xs={6} sm={6} md={6} lg={6}>  
                      <div>  
                        <img src={btEliminar} style={{height: '15px', marginTop: '10px',}}/>  
                      </div>  
                    </Col>  
                  </Row>  
                </Card>  
              </Col>
              <Col xs={24} sm={16} md={8} lg={6}>  
                <Card style={{ backgroundColor: '#CAE2B5', border: '1px solid #ccc', padding: '8px', }}>  
                  <div style={{ height: 'Auto', width: 'Auto', display: 'flex', justifyContent: 'center', alignSelf: 'center', borderColor: 'Black',}}>  
                    <img src={defRec} style={{width: '160px',}}/>  <br />
                  </div>  
                  <Row>  
                    <Col xs={18} sm={18} md={18} lg={18}>  
                      <div> 
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>Plato 5 / 10 porciones  </a> <img src={btEditar} style={{height: '12.8px',}}/>
                      </div>  
                      <div>  
                        <img src={imgCal} style={{height: '13px',}}/>  
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>  Energía: 0.5 cal  </a>
                        <img src={btCompartir}style={{height: '16px',}}/>  
                      </div>  
                    </Col>  
                    <Col xs={6} sm={6} md={6} lg={6}>  
                      <div>  
                        <img src={btEliminar} style={{height: '15px', marginTop: '10px',}}/>  
                      </div>  
                    </Col>  
                  </Row>  
                </Card>  
              </Col>
              <Col xs={24} sm={16} md={8} lg={6}>  
                <Card style={{ backgroundColor: '#CAE2B5', border: '1px solid #ccc', padding: '8px', }}>  
                  <div style={{ height: 'Auto', width: 'Auto', display: 'flex', justifyContent: 'center', alignSelf: 'center', borderColor: 'Black',}}>  
                    <img src={defRec} style={{width: '160px',}}/>  <br />
                  </div>  
                  <Row>  
                    <Col xs={18} sm={18} md={18} lg={18}>  
                      <div> 
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>Plato 5 / 10 porciones  </a> <img src={btEditar} style={{height: '12.8px',}}/>
                      </div>  
                      <div>  
                        <img src={imgCal} style={{height: '13px',}}/>  
                        <a style={{fontFamily: 'Jomhuria', fontSize: '26px', color: '#86A071',}}>  Energía: 0.5 cal  </a>
                        <img src={btCompartir}style={{height: '16px',}}/>  
                      </div>  
                    </Col>  
                    <Col xs={6} sm={6} md={6} lg={6}>  
                      <div>  
                        <img src={btEliminar} style={{height: '15px', marginTop: '10px',}}/>  
                      </div>  
                    </Col>  
                  </Row>  
                </Card>  
              </Col>      
            </Row><br/><br/>  
            <Col xs={24} sm={16} md={8} lg={6}>
              <div style={{display: 'flex',}}>
                <img src={btagregar} style={{height: '52px',}}/>
              </div><br/><br/>
            </Col> 
          </div>
        </div><br/><br/><br/>
      </div>
    </>  
  );  
}
