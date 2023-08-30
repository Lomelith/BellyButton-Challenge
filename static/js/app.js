// Fetch data from the provided URL
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(data => {
    // Extract required data
    const samples = data.samples;
    const metadata = data.metadata;

    // Populate dropdown with options
    const dropdown = d3.select("#selDataset"); // Changed ID to match your HTML
    samples.forEach(sample => {
      dropdown.append("option").attr("value", sample.id).text(sample.id);
    });

    // Initial render
    const initialSample = samples[0];
    updateChartsAndMetadata(initialSample);

    // Dropdown change event handler
    dropdown.on("change", () => {
      const selectedSampleId = dropdown.property("value");
      const selectedSample = samples.find(sample => sample.id === selectedSampleId);
      updateChartsAndMetadata(selectedSample);
    });

    // Update charts and metadata
    function updateChartsAndMetadata(sample) {
      // Update bar chart
      const barChartTrace = {
        x: sample.sample_values.slice(0, 10).reverse(),
        y: sample.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
        type: "bar",
        orientation: "h"
      };
      const barChartData = [barChartTrace];
      const barChartLayout = {
        title: "Top 10 OTUs",
        xaxis: { title: "Sample Values" },
        yaxis: { title: "OTU IDs" }
      };
      Plotly.newPlot("bar", barChartData, barChartLayout);

      // Update bubble chart
      const bubbleChartTrace = {
        x: sample.otu_ids,
        y: sample.sample_values,
        text: sample.otu_labels,
        mode: "markers",
        marker: {
          size: sample.sample_values,
          color: sample.otu_ids,
          colorscale: "Viridis"
        }
      };
      const bubbleChartData = [bubbleChartTrace];
      const bubbleChartLayout = {
        title: "OTU ID vs Sample Values",
        xaxis: { title: "OTU ID" },
        yaxis: { title: "Sample Values" }
      };
      Plotly.newPlot("bubble", bubbleChartData, bubbleChartLayout);

      // Update metadata
      const selectedMetadata = metadata.find(meta => meta.id === parseInt(sample.id));
      const metadataDiv = d3.select("#sample-metadata");
      metadataDiv.html(""); // Clear previous metadata
      for (const key in selectedMetadata) {
        metadataDiv.append("p").text(`${key}: ${selectedMetadata[key]}`);
      }
    }
  })
  .catch(error => {
    console.error("Error fetching data:", error);
  });
