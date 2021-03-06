function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);

}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {

    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;

    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = samples.filter((sampleObj) => sampleObj.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var idSamples = sampleArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.

    var otuDirectory = [];

    for (i in idSamples.otu_ids) {

      otuDirectory.push({
        otuID: idSamples.otu_ids[i],
        otuLabel: idSamples.otu_labels[i],
        otuValues: idSamples.sample_values[i]

      })
    };
    console.log(otuDirectory);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    otuDirectory.sort(function (a, b) {
      return parseFloat(b.otuValues) - parseFloat(a.otuValues);
    });

    var graphingData = otuDirectory.slice(0, 10).reverse();

    var yticks = graphingData.map(row => 'OTU ' + row.otuID);
    var xticks = graphingData.map(row => row.otuValues);
    var textData = graphingData.map(row => row.otuLabel);
    // console.log(yticks);


    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: xticks,
      y: yticks,
      text: textData,
      name: "Bacteria",
      type: "bar",
      orientation: "h"

    }];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"

    };
    // 10. Use Plotly to plot the data with the layout. 

    Plotly.newPlot("bar", barData, barLayout)

    // 1. Create the trace for the bubble chart.
    var xData = otuDirectory.map(row => row.otuID);

    var yData = otuDirectory.map(row => row.otuValues);

    var labelData = otuDirectory.map(row => row.otuLabel);


    var bubbleData = [{
      x: xData,
      y: yData,
      text: labelData,
      mode: "markers",
      marker: {
        size: yData,
        color: xData,
        colorscale: 'Earth'
      }

    }];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Culture per Sample",
      xaxis: {
        title: 'OTU ID'
      },
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      },
      hovermode: 'closest'

    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout)

    // Step 1
    var metadata = data.metadata;
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);

    // Step 2
    var result = resultArray[0];

    // Step 3
    guageNumber = parseFloat(result.wfreq)


    // 4. Create the trace for the gauge chart.
    var gaugeData = [{
      value: guageNumber,
      domain: { x: [0, 1], y: [0, 1] },
      title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week" },
      type: 'indicator',
      mode: 'gauge+number',
      gauge: {
        axis: { range: [0, 10] },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lightgreen" },
          { range: [8, 10], color: "green" }
        ],
        bar: { color: "black" }
      }

    }];

    // 5. Create the layout for the gauge chart.
    var gaugeLayout = {
      width: 600,
      height: 450,
      margin: {
        t: 0, b: 0
      }
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)

  });
}
