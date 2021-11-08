# Astrology Assignment API

The exposed endpoints are described below.


### Request

`GET /home`

### Response

    {
    "banner_val": [...],
    "horoscope_val": [...],
    "astro_val": [...],
    "report_val": [...],
    "questions_val": [...],
    "review_val": [...]
    }


### Request

`GET /talkastro`

### Response

    [
        {
            "availability": {
                "slots": {
                    
                },
                "days": [
                    
                ]
            },
            "imges": {
                
            },
            "_id": "...",
            "astrologer": "",
            "img": "",
            "firstName": "",
            "lastName": "",
            "aboutAstrologer": "",
            "experience": "",
            "rating": ,
            "languages": [
                
            ],
            "costPerMin": ,
            "MinTime": ,
            "isAvailable": ,
            "additionalCharges": ,
            "created": "..."
        },
        {
            ...
        },
        {
            ...
        }
    ]

