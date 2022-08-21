var featureNames = [];

for (var i = 0; i < geoJSON.features.length; i++) {
  var currentFeature = geoJSON.features[i];

  var featureName = currentFeature.properties.Name;
  var featureId = currentFeature.properties.FID;

  console.log(featureName);
  featureNames.push({
    Id: featureId,
    name: featureName,
    hoehe: featurehoehe,
    url: featureurl,
    beschreibung: featurebeschreibung,
  });
}
