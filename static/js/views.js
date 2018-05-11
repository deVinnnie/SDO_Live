/**
 * views.js
 *
 * This file contains some adjustable settings for the main script.
 * Feel free to edit this file!
 *
 */

/**
 * Refresh rate (in miliseconds).
 * Default amount of time during which the image will be displayed.
 *
 */
export var DEFAULT_INTERVAL = 20*1000; //20s

/*
* Interval at which new images are downloaded.
* SDO images are refreshed every 15 minutes.
*/
export var FETCH_INTERVAL = 5*60*1000; //30 minutes


/**
 * The list of instruments/sensors aboard the SDO.
 * This is used to map the abbreviation of each instrument to its full name.
 */
export var sensors = {
    "AIA" : "Atmospheric Imaging Assembly",
    "HMI" : "Helioseismic and Magnetic Imager",
    "EVE" : "Extreme Ultraviolet Variability Experiment"
};

export var months = [
    "januari", 
    "februari",
    "maart",
    "april",
    "mei", 
    "juni",
    "juli",
    "augustus",
    "september",
    "oktober",
    "november",
    "december"
  ];
