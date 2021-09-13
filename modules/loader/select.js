
function select(incomingQuery, loaderContext, source, sourceMap) {
	const styleReg = /<style>[\n\s\t]*([\s\S]*?)[\n\s\t]*<\/style>/;
	const templateReg = /<template>[\n\s\t]*([\s\S]*?)[\n\s\t]*<\/template>/;
	const scriptReg = /<script>[\n\s\t]*([\s\S]*?)[\n\s\t]*<\/script>/;

	if (incomingQuery.type === 'style') {
		const styleRes = source.match(styleReg);
		if (styleRes) {
			return styleRes[1];
		}
		return '';
	}

	if(incomingQuery.type === 'template') {
		const templateRes = source.match(templateReg);
		if (templateRes) {
			const content = templateRes[1];
			const obj = {
				content
			}
			return `export default ${JSON.stringify(obj)}`;
		}
		return `export default ${JSON.stringify({content: ''})}`
	}


	if (incomingQuery.type === 'script') {
		const scriptRes = source.match(scriptReg);
		if (scriptRes) {
			return scriptRes[1];
		}
		return `export default ${JSON.stringify({})}`
	}
}

module.exports = select;