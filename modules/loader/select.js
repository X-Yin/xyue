
function select(incomingQuery, loaderContext, source, sourceMap) {
	const styleReg = /<style>([\s\S]*?)<\/style>/;
	const templateReg = /<template>([\s\S]*?)<\/template>/;
	const scriptReg = /<script>([\s\S]*?)<\/script>/;

	if (incomingQuery.type === 'style') {
		const styleRes = source.match(styleReg);
		if (styleRes) {
			const content = styleRes[1];
			const obj = {
				content
			};
			return `export default ${JSON.stringify(obj)}`;
		}
		return `export default ${JSON.stringify({content: ''})}`
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