import {Sampler} from 'tone';

import A2 from '../assets/guitar-mp3/A2.mp3';
import A3 from '../assets/guitar-mp3/A3.mp3';
import A4 from '../assets/guitar-mp3/A4.mp3';
import As2 from '../assets/guitar-mp3/As2.mp3';
import As3 from '../assets/guitar-mp3/As3.mp3';
import As4 from '../assets/guitar-mp3/As4.mp3';
import B2 from '../assets/guitar-mp3/B2.mp3';
import B3 from '../assets/guitar-mp3/B3.mp3';
import B4 from '../assets/guitar-mp3/B4.mp3';
import C3 from '../assets/guitar-mp3/C3.mp3';
import C4 from '../assets/guitar-mp3/C4.mp3';
import C5 from '../assets/guitar-mp3/C5.mp3';
import Cs3 from '../assets/guitar-mp3/Cs3.mp3';
import Cs4 from '../assets/guitar-mp3/Cs4.mp3';
import Cs5 from '../assets/guitar-mp3/Cs5.mp3';
import D2 from '../assets/guitar-mp3/D2.mp3';
import D3 from '../assets/guitar-mp3/D3.mp3';
import D4 from '../assets/guitar-mp3/D4.mp3';
import D5 from '../assets/guitar-mp3/D5.mp3';
import Ds2 from '../assets/guitar-mp3/Ds2.mp3';
import Ds3 from '../assets/guitar-mp3/Ds3.mp3';
import Ds4 from '../assets/guitar-mp3/Ds4.mp3';
import E2 from '../assets/guitar-mp3/E2.mp3';
import E3 from '../assets/guitar-mp3/E3.mp3';
import E4 from '../assets/guitar-mp3/E4.mp3';
import F2 from '../assets/guitar-mp3/F2.mp3';
import F3 from '../assets/guitar-mp3/F3.mp3';
import F4 from '../assets/guitar-mp3/F4.mp3';
import Fs2 from '../assets/guitar-mp3/Fs2.mp3';
import Fs3 from '../assets/guitar-mp3/Fs3.mp3';
import Fs4 from '../assets/guitar-mp3/Fs4.mp3';
import G2 from '../assets/guitar-mp3/G2.mp3';
import G3 from '../assets/guitar-mp3/G3.mp3';
import G4 from '../assets/guitar-mp3/G4.mp3';
import Gs2 from '../assets/guitar-mp3/Gs2.mp3';
import Gs3 from '../assets/guitar-mp3/Gs3.mp3';
import Gs4 from '../assets/guitar-mp3/Gs4.mp3';

const
  DEFAULT_AUDIO = {
    "A2": A2,
    "A3": A3,
    "A4": A4,
    "A#2": As2,
    "A#3": As3,
    "A#4": As4,
    "B2": B2,
    "B3": B3,
    "B4": B4,
    "C3": C3,
    "C4": C4,
    "C5": C5,
    "C#3": Cs3,
    "C#4": Cs4,
    "C#5": Cs5,
    "D2": D2,
    "D3": D3,
    "D4": D4,
    "D5": D5,
    "D#2": Ds2,
    "D#3": Ds3,
    "D#4": Ds4,
    "E2": E2,
    "E3": E3,
    "E4": E4,
    "F2": F2,
    "F3": F3,
    "F4": F4,
    "F#2": Fs2,
    "F#3": Fs3,
    "F#4": Fs4,
    "G2": G2,
    "G3": G3,
    "G4": G4,
    "G#2": Gs2,
    "G#3": Gs3,
    "G#4": Gs4
  };

function toSamplerMap(url_prefix: string) {
    return {
        "A2": url_prefix + "/A2.mp3",
        "A3": url_prefix + "/A3.mp3",
        "A4": url_prefix + "/A4.mp3",
        "A#2": url_prefix + "/As2.mp3",
        "A#3": url_prefix + "/As3.mp3",
        "A#4": url_prefix + "/As4.mp3",
        "B2": url_prefix + "/B2.mp3",
        "B3": url_prefix + "/B3.mp3",
        "B4": url_prefix + "/B4.mp3",
        "C3": url_prefix + "/C3.mp3",
        "C4": url_prefix + "/C4.mp3",
        "C5": url_prefix + "/C5.mp3",
        "C#3": url_prefix + "/Cs3.mp3",
        "C#4": url_prefix + "/Cs4.mp3",
        "C#5": url_prefix + "/Cs5.mp3",
        "D2": url_prefix + "/D2.mp3",
        "D3": url_prefix + "/D3.mp3",
        "D4": url_prefix + "/D4.mp3",
        "D5": url_prefix + "/D5.mp3",
        "D#2": url_prefix + "/Ds2.mp3",
        "D#3": url_prefix + "/Ds3.mp3",
        "D#4": url_prefix + "/Ds4.mp3",
        "E2": url_prefix + "/E2.mp3",
        "E3": url_prefix + "/E3.mp3",
        "E4": url_prefix + "/E4.mp3",
        "F2": url_prefix + "/F2.mp3",
        "F3": url_prefix + "/F3.mp3",
        "F4": url_prefix + "/F4.mp3",
        "F#2": url_prefix + "/Fs2.mp3",
        "F#3": url_prefix + "/Fs3.mp3",
        "F#4": url_prefix + "/Fs4.mp3",
        "G2": url_prefix + "/G2.mp3",
        "G3": url_prefix + "/G3.mp3",
        "G4": url_prefix + "/G4.mp3",
        "G#2": url_prefix + "/Gs2.mp3",
        "G#3": url_prefix + "/Gs3.mp3",
        "G#4": url_prefix + "/Gs4.mp3"
    }
}

interface Options {
    mp3s_url_prefix?: undefined | string,
    onload?: () => void
}

export default class GuitarSampler extends Sampler {
  constructor (options: Options = {}) {
    super({
      urls: options.mp3s_url_prefix ? toSamplerMap(options.mp3s_url_prefix) : DEFAULT_AUDIO,
      onload: options.onload
    });
  }
}
