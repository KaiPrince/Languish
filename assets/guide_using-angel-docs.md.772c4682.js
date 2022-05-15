import{o as n,c as s,a}from"./app.d7d0a0d8.js";const t='{"title":"Using AngelDocs","description":"","frontmatter":{},"headers":[{"level":2,"title":"Github Action","slug":"github-action"},{"level":3,"title":"Sample workflow","slug":"sample-workflow"}],"relativePath":"guide/using-angel-docs.md","lastUpdated":1652553600000}',e={},p=a('<h1 id="using-angeldocs"><a class="header-anchor" href="#using-angeldocs" aria-hidden="true">#</a> Using AngelDocs</h1><h2 id="github-action"><a class="header-anchor" href="#github-action" aria-hidden="true">#</a> Github Action</h2><p>To use the github action, add this snippet.</p><div class="language-yaml"><pre><code><span class="token comment"># Run our action to document our code</span>\n<span class="token punctuation">-</span> <span class="token key atrule">uses</span><span class="token punctuation">:</span> KaiPrince/AngelDocs@latest\n<span class="token key atrule">with</span><span class="token punctuation">:</span>\n    <span class="token key atrule">files</span><span class="token punctuation">:</span> src\n    <span class="token key atrule">folder</span><span class="token punctuation">:</span> dist\n    <span class="token key atrule">base-url</span><span class="token punctuation">:</span> AngelDocs <span class="token comment"># REPLACE WITH BASE PATH FROM ROOT</span>\n    <span class="token key atrule">project-name</span><span class="token punctuation">:</span> Angel<span class="token punctuation">-</span>docs <span class="token comment"># REPLACE WITH YOUR PROJECT NAME</span>\n</code></pre></div><p>It is recommended to replace <code>latest</code> with the most recent version.</p><h3 id="sample-workflow"><a class="header-anchor" href="#sample-workflow" aria-hidden="true">#</a> Sample workflow</h3><p>This is a basic workflow which generates the documentation site and deploys to GitHub Pages.</p><div class="language-yaml"><pre><code><span class="token key atrule">name</span><span class="token punctuation">:</span> Generate Documentation\n\n<span class="token key atrule">on</span><span class="token punctuation">:</span>\n  <span class="token comment"># Triggers the workflow on push or pull request events but only for the main branch</span>\n  <span class="token key atrule">push</span><span class="token punctuation">:</span>\n    <span class="token key atrule">branches</span><span class="token punctuation">:</span> <span class="token punctuation">[</span>main<span class="token punctuation">]</span>\n  <span class="token key atrule">pull_request</span><span class="token punctuation">:</span>\n    <span class="token key atrule">branches</span><span class="token punctuation">:</span>\n      <span class="token punctuation">-</span> main\n\n  <span class="token comment"># Allows you to run this workflow manually from the Actions tab</span>\n  <span class="token key atrule">workflow_dispatch</span><span class="token punctuation">:</span>\n\n<span class="token key atrule">jobs</span><span class="token punctuation">:</span>\n  <span class="token key atrule">document</span><span class="token punctuation">:</span>\n    <span class="token key atrule">name</span><span class="token punctuation">:</span> Document and deploy\n    <span class="token key atrule">runs-on</span><span class="token punctuation">:</span> ubuntu<span class="token punctuation">-</span>latest\n\n    <span class="token key atrule">steps</span><span class="token punctuation">:</span>\n      <span class="token punctuation">-</span> <span class="token key atrule">uses</span><span class="token punctuation">:</span> actions/checkout@v2\n\n      <span class="token comment"># Run our action to document our code</span>\n      <span class="token punctuation">-</span> <span class="token key atrule">uses</span><span class="token punctuation">:</span> KaiPrince/AngelDocs@latest\n        <span class="token key atrule">with</span><span class="token punctuation">:</span>\n          <span class="token key atrule">files</span><span class="token punctuation">:</span> src\n          <span class="token key atrule">folder</span><span class="token punctuation">:</span> dist\n          <span class="token key atrule">base-url</span><span class="token punctuation">:</span> AngelDocs <span class="token comment"># REPLACE WITH YOUR REPO NAME</span>\n          <span class="token key atrule">project-name</span><span class="token punctuation">:</span> Angel<span class="token punctuation">-</span>docs <span class="token comment"># REPLACE WITH YOUR PROJECT NAME</span>\n\n      <span class="token comment"># Publish to Pages</span>\n      <span class="token punctuation">-</span> <span class="token key atrule">name</span><span class="token punctuation">:</span> Deploy 🚀\n        <span class="token key atrule">uses</span><span class="token punctuation">:</span> JamesIves/github<span class="token punctuation">-</span>pages<span class="token punctuation">-</span>deploy<span class="token punctuation">-</span>action@4.1.0\n        <span class="token key atrule">with</span><span class="token punctuation">:</span>\n          <span class="token key atrule">branch</span><span class="token punctuation">:</span> gh<span class="token punctuation">-</span>pages <span class="token comment"># The branch the action should deploy to.</span>\n          <span class="token key atrule">folder</span><span class="token punctuation">:</span> dist <span class="token comment"># The folder the action should deploy.</span>\n</code></pre></div>',8);e.render=function(a,t,e,o,c,l){return n(),s("div",null,[p])};export default e;export{t as __pageData};