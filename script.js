function Load(bin_counts) {
    // Load data
    d3.csv("data/Data_CT.csv").then(function (data) {
        // Extract the 'values_T' column from your data
        const values_T = data.map(d => +d[Object.keys(d)[0]]); // Convert to a numeric value if needed

        console.log(values_T);

        // Set dimensions for the visualization
        const width = 800; // replace with your desired width
        const height = 600; // replace with your desired height

        const m = 512; // number of columns
        const n = 500; // number of rows
        const min = d3.min(values_T); // minimum value
        const max = d3.max(values_T); // maximum value
        console.log(max)
        // let bin_counts = bin_counts; // number of contours
        const someStep = 1; // step size for slider
        const mid = (min + max) / 4; // mid value

        // Create SVG container for the visualization
        const svg = d3.select("#contourMap")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        // Add a slider
        const slider = d3.select("body").append("input")
            .attr("type", "range")
            .attr("min", 0)
            .attr("max", 1000)
            .attr("step", someStep)
            .on("input", update);

        // Function to update visualization based on slider value
        function update() {
            const sliderValue = +slider.property("value");
            // Update contours based on the slider value
            const contours = d3.contours()
                .size([m, n])
                .thresholds(d3.range(min, max, sliderValue))
                (values_T);
            svg.selectAll("path").remove();
            // Update visualization using updatedContours
            svg.selectAll("path")
                .data(contours)
                .enter().append("path")
                .attr("d", d3.geoPath())
                .attr("fill", d => colors(d.value));
        }

        // Create contours
        const contours = d3.contours()
            .size([m, n])
            .thresholds(d3.range(min, max, bin_counts))
            (values_T);

        console.log(contours);


        // Sample color scale
        const colorScale = d3.scaleDiverging()
            .domain([min, mid, max])
            .interpolator(d3.interpolateBuGn);

        let colors = d3.scaleLinear()
            .domain(d3.range(min, max,
                parseInt(Math.abs(max - min) / 6.7)))
            .range(["#ffffff", "#3e5ebc", "#2b83ba",
                "#abdda6", "#fdae61", "#d7191c"])
            .interpolate(d3.interpolateHcl);


        // Apply color to contours
        svg.selectAll("path")
            .data(contours)
            .enter().append("path")
            .attr("d", d3.geoPath())
            .attr("fill", d => colors(d.value));
    });
}

Load(550);