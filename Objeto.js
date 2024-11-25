class Type {
  constructor(value, displayValue, backendValue) {
    this.value = value;
    this.displayValue = displayValue;
    this.backendValue = backendValue;
  }
}

class Rarity {
  constructor(value, displayValue, backendValue) {
    this.value = value;
    this.displayValue = displayValue;
    this.backendValue = backendValue;
  }
}

class Series {
  constructor(value, colors = [], backendValue) {
    this.value = value;
    this.colors = colors;
    this.backendValue = backendValue;
  }
}

class Set {
  constructor(value, text, backendValue) {
    this.value = value;
    this.text = text;
    this.backendValue = backendValue;
  }
}

class Introduction {
  constructor(charapter, season, text, backendValue) {
    this.charapter = charapter;
    this.season = season;
    this.text = text;
    this.backendValue = backendValue;
  }
}

class Images {
  constructor(smallIcon, icon) {
    this.smallIcon = smallIcon;
    this.icon = icon;
  }
}

class Objeto {
  constructor(
    id,
    name,
    type,
    description,
    rarity,
    series,
    set,
    introduction,
    images,
    added
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.description = description;
    this.rarity = rarity;
    this.series = series;
    this.set = set;
    this.introduction = introduction;
    this.images = images;
    this.added = added;
  }

  monstrarObjeto() {
    console.log(this.id);
    console.log(this.name);
    console.log(this.type);
    console.log(this.description);
    console.log(this.rarity);
    console.log(this.series);
    console.log(this.set);
    console.log(this.introduction);
    console.log(this.images);
    console.log(this.added);
  }
}

const objetoData = {
  id: "Backpack_AbstractMirror",
  name: "Metal Gear Mk. II",
  description: "Backs you up on the battlefield.",
  type: new Type("backpack", "Back Bling", "AthenaBackpack"),
  rarity: new Rarity(
    "gaminglegends",
    "Gaming Legends Series",
    "EFortRarity::Epic"
  ),
  series: new Series(
    "Gaming Legends Series",
    ["8078ffff", "5328d6ff", "3e1398ff", "28085fff", "0d0027ff"],
    "PlatformSeries"
  ),
  set: new Set("Sneaking", "Part of the Sneaking set.", "HidingTime"),
  introduction: new Introduction(
    "5",
    "1",
    "Introduced in Chapter 5, Season 1.",
    28
  ),
  images: new Images(
    "https://fortnite-api.com/images/cosmetics/br/backpack_abstractmirror/smallicon.png",
    "https://fortnite-api.com/images/cosmetics/br/backpack_abstractmirror/icon.png"
  ),
  added: "2024-01-23T13:34:48Z",
};

const objeto = new Objeto(
  objetoData.id,
  objetoData.name,
  objetoData.type,
  objetoData.description,
  objetoData.rarity,
  objetoData.series,
  objetoData.set,
  objetoData.introduction,
  objetoData.images,
  objetoData.added
);

objeto.monstrarObjeto();

// Importar las clases
// import { Type, Rarity, Series, Set, Introduction, Images, Objeto } from './Objeto.js';
