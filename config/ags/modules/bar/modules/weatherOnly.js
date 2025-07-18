import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { MaterialIcon } from "../../.commonwidgets/materialicon.js";
import WeatherService  from '../../../services/weather.js';

const WeatherOnly = () => {
    const weatherIcon = MaterialIcon('device_thermostat', 'large weather-icon txt-norm txt-onLayer1');

    const tempLabel = Widget.Label({
        className: "txt-norm txt-onLayer1",
        setup: self => self.hook(WeatherService, () => {
            self.label = WeatherService.temperature;
        })
    });

    return Widget.Box({
        className: 'weather-content spacing-h-4',
        hpack: 'center',
        vpack: 'center',
        children: [
            weatherIcon,
            tempLabel
        ],
        setup: self => self.hook(WeatherService, () => {
            weatherIcon.label = WeatherService.icon;
            self.tooltipText = `${WeatherService.description}\nFeels like: ${WeatherService.feelsLike}`;
        })
    });
};

export default WeatherOnly;