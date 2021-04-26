    const express = require("express");
    const fs = require('fs');
    const axios = require('axios');
    convert = require('xml-js'),
    moment = require('moment'),
    hostBlogBaseURL = 'https://inncarsholiday.com',
    getBlogsListURL = `https://inncars-api.herokuapp.com/api/countryconfig/getlist`,
    graphQlendPoint = "https://blog.inncarsholiday.com/graphql",
    untrackedUrlsList = [],
    options = { compact: true, ignoreComment: true, spaces: 4 }
payload = {
    query: `{posts(first: 500, after: null) {edges {node {slug}}}}
      `}


var router = express.Router();
router.get("/", (req, res) => {
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    //const fetchBlogsList = function() {
    let landc = axios.post(`${getBlogsListURL}`);
    let blogSlugs = axios.post(`${graphQlendPoint}`, payload);
    untrackedUrlsList.push({ url: 'blog', items: [] });
    Promise.all([landc, blogSlugs]).then(values => {
        //console.log("all promises data",values[0].status,values[1].status)
        if (values[0].status == 200 && values[1].status == 200) {

            values[1].data.data.posts.edges.forEach((slugData) => {
                untrackedUrlsList.push({
                    url: `${slugData.node.slug}`,
                    items: []
                })
            })


            //return ;

            untrackedUrlsList.forEach((parentElement, pi) => {

                values[0].data.data.forEach((element, i) => {
                    if (element.languageCode != "fr") {
                        parentElement.items.push({
                            url: `${hostBlogBaseURL}/${element.country}/${element.languageCode}/${parentElement.url}`,
                            lang: element.lang
                        });
                    }

                    //console.log("graphql.....",parentElement)
                    // values[1].data.data.posts.edges.forEach((slugData) => {
                    //     untrackedUrlsList.urls.push({
                    //         url: `${hostBlogBaseURL}/${element.country}/${element.languageCode}/${slugData.node.slug}`,
                    //         lang: element.lang
                    //     });  
                    // })
                });
            });
            //return;
            filterUniqueURLs();
        } else {
            res.end("Data is empty. Please try again");
        }

    })

    //}

    /* 
        Method to Filter/Unique already existing URLs and new urls we fetched from DB
    */
    const filterUniqueURLs = () => {
        //console.log("inside...",JSON.stringify(untrackedUrlsList));
        //return
        //fs.readFile('sitemap.xml', (err, data) => {
        //if (data) {

        const existingSitemapList =
        {
            "_declaration": { "_attributes": { "version": "1.0", "encoding": "utf-8" } },
            'urlset': {
                "_attributes": {
                    "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
                    "xmlns:xhtml": "http://www.w3.org/1999/xhtml"
                },
                'url': []
            }
        };
        // let existingSitemapURLStringList = [];
        // if (existingSitemapList.urlset && existingSitemapList.urlset.url && existingSitemapList.urlset.url.length) {
        //     existingSitemapURLStringList = existingSitemapList.urlset.url.map(ele => ele.loc._text);
        // }

        untrackedUrlsList.forEach((ele, index) => {

            ele.items.forEach((itms) => {
                let obj = { loc: '', "xhtml:link": [] }
                obj.loc = {
                    _text: itms.url,
                }
                ele.items.forEach((itmsinn) => {
                    obj["xhtml:link"].push({
                        "_attributes": {
                            "rel": "alternate",
                            "hreflang": itmsinn.lang,
                            "href": itmsinn.url,
                        }
                    })
                })


                // changefreq: {
                //     _text: 'monthly'
                // },
                // priority: {
                //     _text: 0.8
                // },
                // lastmod: {
                //     _text: moment(new Date()).format('YYYY-MM-DD')
                // }
                // });

                // untrackedUrlsList.forEach((inner) => {
                //         obj["xhtml:link"].push({
                //             "_attributes":{
                //                 "rel":"alternate",
                //                 "hreflang":inner.lang,
                //                 "href":inner.url,
                //             }
                //         })

                // })
                existingSitemapList.urlset.url.push(obj);
                obj = {}
            })


        });
        createSitemapFile(existingSitemapList);
        //}
        //});
    }

    /* 
        Method to convert JSON format data into XML format
    */
    const createSitemapFile = (list) => {

        //list.urlset.url.forEach((element) => {
        //console.log("inside elements",JSON.stringify(list))
        // })
        // = '<?xml version="1.0" encoding="UTF-8"?>'
        let finalXML;
        finalXML = convert.json2xml(list, options); // to convert json text to xml text
        saveNewSitemap(finalXML);
    }

    /* 
        Method to Update sitemap.xml file content
    */
    const saveNewSitemap = (xmltext) => {
        try{
        if(xmltext){
        fs.writeFile('src/blog-sitemap.xml', xmltext, (err) => {
            if (err) {
                return console.log(err);
            }

            console.log("The file was saved!");
        });
        res.end("File genereted successfully");
    } else {
        res.end("Data is empty. Please try again");
    }
} catch (err){
    res.end("something happened wrong. Please try again");
}
    }
     

});

module.exports = router;
//fetchBlogsList();