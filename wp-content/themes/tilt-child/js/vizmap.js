
let dataPath = dataurl ? dataurl : '';
let containerWidth = document.getElementById('vizmap').offsetWidth;
let plotWidth = containerWidth ? containerWidth: window.innerWidth;
// plotWidth = 1200;

d3.json(dataPath + "vizdata.json", function(dataJson) {
    d3.json(dataPath + "viztype.json", function(vizTypes) {
        var plot = new ConceptMap("vizmap", "graph-info", plotWidth, 800, dataJson, vizTypes);
    });
});



var ConceptMap = function(chartElementId, infoElementId, canvas_width, canvas_height, dataJson, vizTypes){

        //T=d3.map(dataJson);
        //q=d3.merge(T.values());

        //console.warn(T,q);
        // console.warn(dataJson)

    var dataInput = dataJson;

    // transform the data into a useful representation
    // 1 is inner, 2, is outer

    // need: inner, outer, links
    //
    // inner: 
    // links: { inner: outer: }

    //-------------------------------
    //----------- SETUP -------------
    //-------------------------------
    // var transition = d3.transition();
    // from d3 colorbrewer: 
    // This product includes color specifications and designs developed by Cynthia Brewer (http://colorbrewer.org/).
    var colors = ["#a50026","#d73027","#f46d43","#fdae61","#fee090","#ffffbf","#e0f3f8","#abd9e9","#74add1","#4575b4","#313695"]
    var color = d3.scale.linear()
        .domain([60, 220])
        .range([colors.length-1, 0])
        .clamp(true);

    var svg_width = canvas_width;
    var svg_height = canvas_height;
    var rect_width = 160;
    var rect_height = 18;

    const right_translate_x = 2*svg_width / 3;
    const right_translate_y = canvas_height / 2;
    const left_translate_x = 80;
    const left_translate_y = canvas_height * .65;

    var link_width = "1px"; 

    var svg = d3.select("#"+chartElementId).append("svg")
        .attr("width", svg_width)
        .attr("height", canvas_height)
        .on("click", svgonclick);


    function get_color(name)
    {
        var c = Math.round(color(name));
        if (isNaN(c))
            return '#dddddd';	// fallback color
        
        return colors[c];
    }

    function get_color_by_id(id){
        
    }

    function projectX(x)
    {
        return ((x - 90) / 180 * Math.PI) - (Math.PI/2);
    }
    function setTranslated(element) {
      let childElement = element.select('text');
      var currentTranslation = getTranslation(element.attr("transform"));
      childElement.attr("x", +childElement.attr("x") + currentTranslation[0]);
      childElement.attr("y", +childElement.attr("y") + currentTranslation[1]);
      childElement.attr("transform", null)
    }
    
    function getTranslation(transform) {
      var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttributeNS(null, "transform", transform);
      var matrix = g.transform.baseVal.consolidate().matrix;
      return [matrix.e, matrix.f];
    }

    function textWrap(text, width) {
        text.each(function() {
          var text = d3.select(this),
              words = text.text().split(/\s+/).reverse(),
              word,
              line = [],
              lineNumber = 0,
              lineHeight = 1.1, // ems
              y = text.attr("y"),
              dy = parseFloat(text.attr("dy")),
              tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
              line.pop();
              tspan.text(line.join(" "));
              line = [word];
              tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
          }
        });
    }


    //-------------------------------
    //----------- DATA -------------
    //-------------------------------

    var outer = d3.map();
    var inner = [];
    var links = [];
    var typeLinks = [];
    var types = d3.map();

    var outerId = [0];
    var typeId = [0];

    // console.warn('datajson', dataInput)

    dataInput.forEach(function(d){
        
        if (d == null)
            return;
        
        i = { id: 'i' + inner.length, name: d.name, related_links: [] };
        i.related_nodes = [i.id];
        inner.push(i);
        
        if (!Array.isArray(d.links))
            d.links = [d.links];
        
        d.links.forEach(function(d1){
            
            o = outer.get(d1);
            
            if (o == null)
            {
                o = { name: d1,	id: 'o' + outerId[0], related_links: [] };
                o.related_nodes = [o.id];
                outerId[0] = outerId[0] + 1;	
                
                outer.set(d1, o);
            }
            
            // create the links
            l = { id: 'l-' + i.id + '-' + o.id, inner: i, outer: o }
            links.push(l);
            
            // and the relationships
            i.related_nodes.push(o.id);
            i.related_links.push(l.id);
            o.related_nodes.push(i.id);
            o.related_links.push(l.id);
        });
        
        d.types.forEach(function(d1){
            
            t = types.get(d1);
            
            if (t == null)
            {
                t = { id: d1, name: 't' + typeId[0], related_links: [] };
                t.related_nodes = [t.id];
                typeId[0] = typeId[0] + 1;	
                
                types.set(d1, t);
            }
            
            // create the links
            l = { id: 'l-' + i.id + '-' + t.id, inner: i, type: t }
            typeLinks.push(l);
            
            // and the relationships
            i.related_nodes.push(t.id);
            i.related_links.push(l.id);
            t.related_nodes.push(i.id);
            t.related_links.push(l.id);
        });
    });

    var sortByName = function(a,b) {
        // var textA = a.name.toUpperCase();
        // var textB = b.name.toUpperCase();
        // return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
        res = a.name.toUpperCase().localeCompare(b.name.toUpperCase());
        return res;
    };

    let data = {
        "inner": inner,
        // Sort alphabetically by name
        "outer": [...outer.values()],
        "links": links,
        "typeLinks": typeLinks,
        "types": types.values()
    }

    // sort the data -- TODO: have multiple sort options
    outer = data.outer;
    data.outer = Array(outer.length);

    var i1 = 0;
    var i2 = outer.length - 1;

    for (var i = 0; i < data.outer.length; ++i)
    {
        if (i % 2 == 1)
            data.outer[i2--] = outer[i];
        else
            data.outer[i1++] = outer[i];
    }
    data.outer = data.outer.sort(sortByName);

    // console.warn('data-----',data)
    // console.log(data.outer.reduce(function(a,b) { return a + b.related_links.length; }, 0) / data.outer.length);

    //-------------------------------
    //--------- LEFT SETUP ----------
    //-------------------------------

    let clusterTree = data => {
        const width = svg_width /2;
        const height = canvas_height/2;
        const root = d3.hierarchy(data).sort((a, b) => d3.descending(a.height, b.height) || d3.ascending(a.data.name, b.data.name));
        root.dx = 15;                   // vertical seperation
        root.dy = width / (root.height + 2);    // hozt seperation, use root.height if its a vertical tree
        // console.warn('root dy',root, root.dx, root.dy)
        return d3.cluster().nodeSize([root.dx, root.dy])(root);
    }

    function autoBox() {
        const {x, y, width, height} = this.getBBox();
        console.warn(this.getBBox())
        return [x, y, width, height];
    }

    const root = clusterTree(vizTypes);

    root.leaves().forEach(function(node) {
        const id = node.data.id
        if(t = types.get(id)){
            // console.warn('---get type be id',t,node);
            t['x'] = node.x;
            t['y'] = node.y;
        }
    });
    console.warn('----types', types)

    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
        if (d.x > x1) x1 = d.x;
        if (d.x < x0) x0 = d.x;
    });

    //-------------------------------
    //-------- RIGHT SETUP ----------
    //-------------------------------
    var il = data.inner.length;
    var ol = data.outer.length;

    // Functions
    var inner_y = d3.scale.linear()
        .domain([0, il])
        .range([-(il * rect_height)/2, (il * rect_height)/2]);

    // Angle for radial plot
    mid = (data.outer.length/2.0)
    var outer_x = d3.scale.linear()
        // .domain([0, mid, mid, data.outer.length])
        // .range([15, 170, 190 ,355]);
        .domain([0, data.outer.length])
        .range([25, 155]);  // From 35deg to 145deg

    // Radius for radial plot
    var outer_y = d3.scale.linear()
        .domain([0, data.outer.length])
        .range([0, svg_height / 2 - 120]);
    // var outer_y = d3.scale.pow()
    //     .domain([0, data.outer.length/2, data.outer.length])
    //     .range([svg_height/2.5, svg_height/3, svg_height/2.5]);

    var ellipseRadius = function(a,b,deg){
        rad = deg*Math.PI/180.0;
        num = a*b;
        den = Math.sqrt(Math.pow(b*Math.cos(rad),2)+Math.pow(a*Math.sin(rad),2));
        return num/den;
    }

    // setup positioning
    data.outer = data.outer.map(function(d, i) { 
        // console.warn(d,i)
        d.x = outer_x(i);
        // d.y = svg_height / 3;
        d.y = ellipseRadius(svg_height / 2.5,250, outer_x(i))
        return d;
    });

    data.inner = data.inner.map(function(d, i) { 
        d.x = -(rect_width / 2);
        d.y = inner_y(i);
        return d;
    });


    //-------------------------------
    //--------- RIGHT DRAW ----------
    //-------------------------------

    var g1 = svg.append("g")
        .attr("transform", "translate(" + right_translate_x + "," + right_translate_y + ")");
        
    //----- Links between inner and outer
    // Can't just use d3.svg.diagonal because one edge is in normal space, the
    // other edge is in radial space. Since we can't just ask d3 to do projection
    // of a single point, do it ourselves the same way d3 would do it.  
    // Create bezier curve as link
    var diagonal = d3.svg.diagonal()
    .source(function(d) { 
        return {
            "x": d.outer? d.outer.y * Math.cos(projectX(d.outer.x)) : 0, 
            "y": d.outer? -d.outer.y * Math.sin(projectX(d.outer.x)): 0
        }; 
    })            
    .target(function(d) {
        return {
            "x": d.inner.y + rect_height/2,
            "y": d.outer? d.outer.x > 180 ? d.inner.x : d.inner.x + rect_width: 0
        }; 
    })
    .projection(function(d) { return [d.y, d.x]; });


    // Draw links
    var link = g1.append('g').attr('class', 'links').selectAll(".link")
        .data(data.links)
    .enter().append('path')
        .attr('class', 'link')
        .attr('id', function(d) { return d.id })
        .attr("d", diagonal)
        .attr('stroke', function(d) { return get_color(d.inner.name); })
        .attr('stroke-width', link_width);

    // Draw outer nodes
        //Title
    var otitle = g1.append("text")
    .attr("class", "title")
    .attr("dy", 0)
    .attr('text-anchor', 'middle')
    .attr("transform", `translate(200, ${-((il+1) * rect_height)/2 - 20})`)
    .text("Visualisation by Functions")
    .call(textWrap, 200)
    
    console.warn('text', otitle)

    var onode = g1.append('g')
        .selectAll(".outer_node")
        .data(data.outer)
    .enter().append("g")
        .attr("class", "outer_node")
        .attr("transform", function(d) { return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")"; })
        .on("click", onclick)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
    
    onode.append("circle")
        .attr('id', function(d) { return d.id })
        .attr("r", 4.5);
    
    onode.append("circle")
        .attr('r', 20)
        .attr('visibility', 'hidden');
    
    onode.append("text")
        .attr('id', function(d) { return d.id + '-txt'; })
        .attr("dy", ".31em")
        .attr("text-anchor", function(d) { return d.x < 180 ? "start" : "end"; })
        .attr("transform", function(d) { return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)"; })
        .text(function(d) { return d.name; });
        // Add rect behind text label so mouseover works over the whole thing
    onode.selectAll("text")
        .each(function(d){
            nwidth = this.getBoundingClientRect().width + 10;
            parent = d3.select(this.parentNode)
            const isEndLeaf = this.getAttribute("text-anchor") == 'end'
            parent.append("rect")
                .attr('fill', "transparent")
                .attr("width",nwidth)
                .attr("height",20)
                .attr("x", () => {return isEndLeaf? nwidth * -1 : 0})
                .attr("y",20/2 * -1)
        })
    
    // inner nodes
        //Title
    g1.append("text")
    .attr("class", "title")
    .attr('text-anchor', 'middle')
    .attr("transform", `translate(0, ${-((il+1) * rect_height)/2 - 20})`)
    .text("Plot Types");

    var inode = g1.append('g').selectAll(".inner_node")
        .data(data.inner)
    .enter().append("g")
        .attr("class", "inner_node")
        .attr('id', function(d) { return d.id;})
        .attr("transform", function(d, i) { return "translate(" + d.x + "," + d.y + ")"})
        .on("click", onclick)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout);
    
    inode.append('rect')
        .attr('width', rect_width)
        .attr('height', rect_height)
        .attr('id', function(d) { return d.id; })
        .attr('fill', '#eeeeee');
    
    inode.append("text")
        .attr('id', function(d) { return d.id + '-txt'; })
        .attr('text-anchor', 'middle')
        .attr("transform", "translate(" + rect_width/2 + ", " + rect_height * .75 + ")")
        .text(function(d) { return d.name; });

    // need to specify x/y/etc

    d3.select(self.frameElement).style("height", canvas_height - 150 + "px");

    //-------------------------------
    //---------- LEFT DRAW ----------
    //-------------------------------
    const g2 = svg.append("g")
      .style("font", "10px sans-serif")
      .style("margin", "5px")
      .attr("width", svg_width/3 + "px")
      .attr("transform", `translate(${left_translate_x},${left_translate_y})`);

      
    //Title
    g2.append("text")
    .attr("class", "title")
    .attr('text-anchor', 'middle')
    .attr("transform", `translate(${svg_width/3/2}, ${-left_translate_y + 25})`)
    .text("Data Types");

    // Tree map links
    const link2 = g2.append("g")
    .attr("fill", "none")
    .attr("stroke", "#555")
    .attr("stroke-opacity", 0.4)
    .attr("stroke-width", 1.5)
    .selectAll("path")
    .data(root.links())
    .join("path")
        .attr("d", d => `
        M${d.target.y},${d.target.x}
        C${d.source.y + root.dy / 2},${d.target.x}
            ${d.source.y + root.dy / 2},${d.source.x}
            ${d.source.y},${d.source.x}
        `);



    // Draw Treemap nodes and label
    const treeNode = g2.append("g")
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
    .selectAll("g")
    .data(root.descendants())
    .join("g")
        .attr("class", "treemap-node")
        .on("click", onclick)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .attr("id", function(d){return d.data.id})
        .attr("transform", d => `translate(${d.y},${d.x})`);

    treeNode.append("circle")
        .attr("fill", d => d.children ? "#555" : "#999")
        .attr("r", 2.5);

    treeNode.append("text")
        .attr("class", "label")
        .attr("dy", "0.31em")
        .attr("x", d => d.children ? -6 : 6)
        .text(d => d.data.name)
    .filter(d => d.children)
        .attr("text-anchor", "end")
    .clone(true).lower()
        .attr("class", "")
        .attr("stroke", "white");

    // Add rect behind text label so mouseover works over the whole thing
    treeNode.selectAll("text.label")
        .each(function(d){
            nwidth = this.getBoundingClientRect().width + 10;
            parent = d3.select(this.parentNode)
            const isEndLeaf = this.getAttribute("text-anchor") == 'end'
            parent.append("rect")
                .attr('fill', "transparent")
                .attr("width",nwidth)
                .attr("height",20)
                .attr("x", () => {return isEndLeaf? nwidth * -1 : 0})
                .attr("y",20/2 * -1)
        })
            
    // node.selectAll("text.label").each(function(d){
    //     console.warn('----label',d, this.node())
    //     let node = document.createElement("rect")
    //     node.setAttribute("width", 100);
    //     return this.appendChild(node);
    //     this.parentNode.append(() => document.createElement("rect"))
    //     // .attr('width', d.getBBox().width)
    //     // .attr('height', 10)
    //     // .on("mouseover", mouseover)
    //     // .on("mouseout", mouseout)
    // })


    // Tree to Inner links
    var diagonal2 = d3.svg.diagonal()
    .source(function(d) { 
        bbox = treeNode.select(`#${d.type.id} > text`).node()
        twidth = bbox? bbox.getBBox().width + 10: 50
        ret = {
            "x": d.type.x, 
            "y": d.type.y  + twidth
        }
        return ret;
    })            
    .target(function(d) {
        left_right_translation_diff_y = left_translate_y - right_translate_y;
        ret = {
            "x": d.inner.y + rect_height/2 - left_right_translation_diff_y,
            "y": d.inner.x + right_translate_x - 80
        }; 
        return ret;
    })
    .projection(function(d) { return [d.y, d.x]; });


    // Draw Tree to Inner links
    var link3 = g2.insert('g', ':first-child').attr('class', 'type-links').selectAll(".type-link")
        .data(data.typeLinks)
    .enter().append('path')
        .attr("fill", "none")
        .attr('class', 'type-link')
        .attr('id', function(d) { return d.id })
        .attr("d", diagonal2)
        .attr('stroke', '#dddddd')//function(d) { return get_color(d.type.name); })
        .attr('stroke-width', link_width);


    // yield svg.node();
    g2.attr("viewBox", autoBox);




    function highlightTreemap(d, isClick){
        // Highlight self & descendants
        d3.select('#'+d.data.id).classed("highlight", true)
        ancestorsAndChildren = d.ancestors() ? d.ancestors() : [];
        ancestorsAndChildren.concat(d.descendants());
        ancestorsAndChildren.forEach(function(e){
            d3.select('#'+e.data.id).classed("highlight", true)
        })

        if(d.children){
            let leaves = d.leaves();
            d.leaves().forEach(function(e){
                highlightConceptmap(types.get(e.data.id), isClick);
            });
        } else {
            highlightConceptmap(types.get(d.data.id), isClick);
        }
    }
    function unhighlightTreemap(d){
        // Highlight self
        d3.select('#'+d.data.id).classed("highlight", false)
        unhighlight(types.get(d.data.id));
    }

    function highlightConceptmap(d, isClick){
        if(!d) return false;

        // bring to front
        d3.selectAll('.links .link').sort(function(a, b){ return d.related_links.indexOf(a.id); });	
        d3.selectAll('.type-links .type-link').sort(function(a, b){ return d.related_links.indexOf(a.id); });	
        
        // Highlight Nodes
        for (var i = 0; i < d.related_nodes.length; i++){
            d3.select('#' + d.related_nodes[i]).classed('highlight', true);
            d3.select('#' + d.related_nodes[i] + '-txt').classed('highlight', true);
            if(isClick){
                d3.select('#' + d.related_nodes[i]).classed('clicked', true);
                d3.select('#' + d.related_nodes[i] + '-txt').classed('clicked', true);
            }
        }
        // Highlight Links
        for (var i = 0; i < d.related_links.length; i++){
            d3.select('#' + d.related_links[i]).classed('highlight', true);
            if(isClick){
                d3.select('#' + d.related_links[i]).classed('clicked', true);
            }
        }
    }

    // Unhighlight can be from mouseover or click
    function unhighlight(d){
        d3.selectAll(".link, .type-link").classed("highlight", false) ;
        d3.selectAll(".inner_node, .outer_node, g, circle").classed("highlight", false);
        d3.selectAll("text, .highlight text").classed("highlight", false);

        // Re-highlight clicked
        d3.selectAll(".link.clicked, .type-link.clicked").classed("highlight", true) ;
        d3.selectAll(".inner_node.clicked, .outer_node.clicked, g.clicked, circle.clicked").classed("highlight", true);

        return true;
        for (var i = 0; i < d.related_nodes.length; i++)
        {
            d3.select('#' + d.related_nodes[i]).classed('highlight', false);
            d3.select('#' + d.related_nodes[i] + '-txt').attr("font-weight", 'normal');
        }
        
        for (var i = 0; i < d.related_links.length; i++)
        {
            d3.select('#' + d.related_links[i]).attr('stroke-width', link_width);
            d3.select('#' + d.related_links[i]).classed('highlight', false);
        }
    }




    function mouseover(d){
        if(d.data){
            highlightTreemap(d)
        } else {
            highlightConceptmap(d)
        }
    }

    function mouseout(d){   	
        if(d.data){
            unhighlightTreemap(d)
        } else {
            unhighlight(d)
        }
    }

    function clearAllClicks(d){
        d3.selectAll('.clicked').classed("clicked", false);
        unhighlight(d)
    }

    function onclick(d){
        // Clear all clicked
        clearAllClicks(d);
        
        if(d.data){
            highlightTreemap(d, true)
        } else {
            highlightConceptmap(d, true)
        }
        d3.event.stopPropagation();
    }

    function svgonclick(d){
        clearAllClicks(d);
    }


};