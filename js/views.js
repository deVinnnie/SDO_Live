/**
 * views.js
 *
 * This file contains some adjustable settings for the main script.
 * Feel free to edit this file!
 *
 * @author Vincent Ceulemans
 *
 */

/**
 * Refresh rate (in miliseconds). 
 * SDO images are refreshed every 15 minutes.
 */
var DEFAULT_INTERVAL = 10*1000; //10s

/**
 *  Image resolution in pixels.
 *  Example: 512, 1024...
 *  Check http://sdo.gsfc.nasa.gov/data/ for available resolutions. 
 */
var IMAGE_RESOLUTION = 1024;

/**
 * The list of images to retrieve.
 *
 * Each entry contains the following values: 
 * id: Used for feed retrieval. Do not change this value.
 * title: Text displayed after "SDO Live -" in H1 of page. 
 * duration: Amount of time to wait before showing the next image.
 *          (Expressed in miliseconds: 1 seconds = 1000)
 *          If no duration is specified the default value in DEFAULT_INTERVAL is used.
 *
 * You can comment out entries which should not be displayed. 
 * 
 */
var views= [
    {
        id: "aia_0193",
        title: "AIA 193",
        duration: 20000, //20 seconds
        sensor: "AIA"
    },
    {
        id:"aia_0304",
        title: "AIA 304",
        sensor: "AIA"
    },
    {
        id:"aia_0171",
        title: "AIA 171",
        sensor: "AIA"
    },
    {
        id:"aia_0211",
        title: "AIA 211",
        sensor: "AIA"
    },
    {
        id:"aia_0131",
        title: "AIA 131",
        sensor: "AIA"
    },
    {
        id:"aia_0335",
        title: "AIA 335",
        sensor: "AIA"
    },
    {
        id:"aia_0094",
        title: "AIA 94",
        sensor: "AIA"
    },
    {
        id:"aia_1600",
        title: "AIA 1600",
        sensor: "AIA"
    },
    {
        id:"aia_1700",
        title: "AIA 1700",
        sensor: "AIA"
    },
    {
        id: "hmib",
        title: "HMI Magnetogram <small>[Zwart-Wit]</small>",
        sensor: "HMI"
    },
    {
        id: "hmibc",
        title: "HMI Magnetogram <small>[Kleur]</small>",
        sensor: "HMI"
    },
    {
        id: "COMP094335193",
        title: "Composite 094, 335, 193",
        sensor: "AIA"
    },
    {
        id:"COMP211193171",
        title: "Composite 211, 193, 171",
        sensor: "AIA"
    },
    {
        id:"COMP304211171",
        title: "Composite 304, 211, 171",
        sensor: "AIA"
    },
    {
        id: "hmii",
        title: "HMI Intensitygram",
        sensor: "HMI"
    }
];

/**
 * The list of instruments/sensors aboard the SDO. 
 * This is used to map the abbreviation of each instrument to its full name. 
 */
var sensors = [
    {
        abbr: "AIA",
        name: "Atmospheric Imaging Assembly"
    },
    {
        abbr: "HMI",
        name: "Helioseismic and Magnetic Imager"
    },
    {
        abbr: "EVE",
        name: "Extreme Ultraviolet Variability Experiment"
    }
]
