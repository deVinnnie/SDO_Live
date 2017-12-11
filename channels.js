/**
 * The list of images to retrieve.
 *
 * Each entry contains the following values:
 * id: Used for feed retrieval. Do not change this value.
 * title: Text displayed after "SDO Live -" in H1 of page.
 * duration: Amount of time to wait before showing the next image.
 *          (Expressed in milliseconds: 1 seconds = 1000)
 *          If no duration is specified the default value in DEFAULT_INTERVAL is used.
 *
 * You can comment out entries which should not be displayed.
 *
 */
exports.channels = [
    {
        id: "aia_0193",
        title: "AIA 193",
        sensor: "AIA"
    },
    {
        id:"aia_0304",
        title: "AIA 304",
        sensor: "AIA"
    },
    /*{
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
    }*/
];
