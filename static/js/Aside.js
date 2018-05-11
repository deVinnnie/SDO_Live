import {ProbeOverlay} from './ProbeOverlay';
import {ErrorIndicator, LoadingIndicator} from './Indicators';

import {months,sensors} from './views';

/*
* Some additional information about the current image
*/
export function Aside(props){
    let title = props.current.title;
    let sensor = props.current.sensor;
    let sensorFullName = sensors[sensor];
    let time = new Date(props.current.latest.date);

    let date = ('0' + time.getDate()).slice(-2)
                + " "
                + months[time.getMonth()];

    let local =
          ('0' + time.getHours()).slice(-2) + "h" +
          ('0' + time.getMinutes()).slice(-2) + "m"

    return <aside>
              <div id="informatie">
                    <h1>SDO Live Beeld
                        <LoadingIndicator enabled={props.loading}/>
                        <ErrorIndicator enabled={props.error}/>
                    </h1>
                    <h2 id="titel">{title}</h2>

                    <div id="metadata">
                        <ul>
                          <li>
                            <span className="date-icon"/>
                            <span id="date">
                            {date}
                            </span>
                          </li>

                          <li>
                            <span className="time-icon"/>
                            <span id="time">
                                {local}
                            </span>
                          </li>

                          <li>
                            <span className="sensor-icon"/>
                            <span id="sensor">
                                {sensor} ({sensorFullName})
                            </span>
                          </li>
                          </ul>
                    </div>
                    <ProbeOverlay current={props.current} />
                </div>
               {/* This stuff needs to be here according to http://sdo.gsfc.nasa.gov/data/rules.php */}
                <p id="courtesy-message">Courtesy of NASA/SDO and the AIA, EVE, and HMI science teams.</p>
            </aside>
}