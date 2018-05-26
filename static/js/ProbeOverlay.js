export function ProbeOverlay(props){
  var src="images/spacecraft/spacecraft-" + props.current.sensor.toLowerCase() + "-overlay.png";
  
  return <div className="sensor">
    <img id="spacecraft" src={src} width="350px"/>
  </div>;
}