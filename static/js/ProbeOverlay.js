export function ProbeOverlay(props){
  let src = "images/spacecraft/spacecraft.png";
  if(props.current.sensor){
    src="images/spacecraft/spacecraft-" + props.current.sensor.toLowerCase() + "-overlay.png";
  }
  
  return <div className="sensor">
    <img id="spacecraft" src={src} width="350px"/>
  </div>;
}
