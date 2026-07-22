"""NZ city registries: centre + sample points for dry/wet classification."""

from __future__ import annotations

CITIES: dict[str, dict] = {
    "christchurch": {
        "id": "christchurch",
        "name": "Christchurch",
        "lat": -43.5321,
        "lon": 172.6362,
        "zoom": 11,
        "spots": [
            {"name": "Central City", "lat": -43.5321, "lon": 172.6362},
            {"name": "Riccarton", "lat": -43.5299, "lon": 172.5989},
            {"name": "Hornby", "lat": -43.5430, "lon": 172.5250},
            {"name": "Halswell", "lat": -43.5830, "lon": 172.5650},
            {"name": "Papanui", "lat": -43.4940, "lon": 172.6080},
            {"name": "Linwood", "lat": -43.5310, "lon": 172.6750},
            {"name": "New Brighton", "lat": -43.5070, "lon": 172.7320},
            {"name": "Sumner", "lat": -43.5660, "lon": 172.7520},
            {"name": "Airport", "lat": -43.4894, "lon": 172.5320},
            {"name": "Kaiapoi", "lat": -43.3780, "lon": 172.6580},
            {"name": "Lyttelton", "lat": -43.6030, "lon": 172.7190},
            {"name": "Rolleston", "lat": -43.5890, "lon": 172.3790},
        ],
    },
    "auckland": {
        "id": "auckland",
        "name": "Auckland",
        "lat": -36.8509,
        "lon": 174.7645,
        "zoom": 11,
        "spots": [
            {"name": "CBD", "lat": -36.8509, "lon": 174.7645},
            {"name": "Ponsonby", "lat": -36.8560, "lon": 174.7440},
            {"name": "Newmarket", "lat": -36.8690, "lon": 174.7770},
            {"name": "Mount Eden", "lat": -36.8770, "lon": 174.7640},
            {"name": "Remuera", "lat": -36.8800, "lon": 174.8000},
            {"name": "Takapuna", "lat": -36.7870, "lon": 174.7730},
            {"name": "Devonport", "lat": -36.8320, "lon": 174.7960},
            {"name": "Onehunga", "lat": -36.9200, "lon": 174.7850},
            {"name": "Avondale", "lat": -36.8980, "lon": 174.6970},
            {"name": "Mission Bay", "lat": -36.8560, "lon": 174.8310},
            {"name": "Airport", "lat": -37.0080, "lon": 174.7850},
            {"name": "Henderson", "lat": -36.8810, "lon": 174.6310},
        ],
    },
    "wellington": {
        "id": "wellington",
        "name": "Wellington",
        "lat": -41.2865,
        "lon": 174.7762,
        "zoom": 12,
        "spots": [
            {"name": "Central City", "lat": -41.2865, "lon": 174.7762},
            {"name": "Te Aro", "lat": -41.2940, "lon": 174.7780},
            {"name": "Kelburn", "lat": -41.2880, "lon": 174.7670},
            {"name": "Newtown", "lat": -41.3120, "lon": 174.7790},
            {"name": "Island Bay", "lat": -41.3370, "lon": 174.7730},
            {"name": "Miramar", "lat": -41.3200, "lon": 174.8200},
            {"name": "Karori", "lat": -41.2840, "lon": 174.7400},
            {"name": "Johnsonville", "lat": -41.2240, "lon": 174.8070},
            {"name": "Petone", "lat": -41.2270, "lon": 174.8700},
            {"name": "Lower Hutt", "lat": -41.2090, "lon": 174.9070},
            {"name": "Airport", "lat": -41.3270, "lon": 174.8050},
            {"name": "Oriental Bay", "lat": -41.2910, "lon": 174.7940},
        ],
    },
    "dunedin": {
        "id": "dunedin",
        "name": "Dunedin",
        "lat": -45.8788,
        "lon": 170.5028,
        "zoom": 12,
        "spots": [
            {"name": "Central City", "lat": -45.8788, "lon": 170.5028},
            {"name": "North Dunedin", "lat": -45.8630, "lon": 170.5140},
            {"name": "South Dunedin", "lat": -45.8980, "lon": 170.5030},
            {"name": "St Clair", "lat": -45.9110, "lon": 170.4910},
            {"name": "St Kilda", "lat": -45.9040, "lon": 170.5100},
            {"name": "Mornington", "lat": -45.8810, "lon": 170.4850},
            {"name": "Roslyn", "lat": -45.8620, "lon": 170.4920},
            {"name": "Port Chalmers", "lat": -45.8160, "lon": 170.6210},
            {"name": "Mosgiel", "lat": -45.8750, "lon": 170.3480},
            {"name": "Airport", "lat": -45.9280, "lon": 170.1980},
            {"name": "Caversham", "lat": -45.8960, "lon": 170.4860},
            {"name": "Opoho", "lat": -45.8550, "lon": 170.5300},
        ],
    },
}

DEFAULT_CITY_ID = "christchurch"


def list_cities() -> list[dict]:
    return [
        {
            "id": city["id"],
            "name": city["name"],
            "lat": city["lat"],
            "lon": city["lon"],
            "zoom": city["zoom"],
        }
        for city in CITIES.values()
    ]


def get_city(city_id: str | None) -> dict:
    if city_id and city_id in CITIES:
        return CITIES[city_id]
    return CITIES[DEFAULT_CITY_ID]
