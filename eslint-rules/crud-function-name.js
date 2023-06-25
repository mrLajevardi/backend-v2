/* eslint-disable */
module.exports = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Enforce function names in ./src/apps to follow the *TableService format',
            category: 'Stylistic Issues',
            recommended: true,
        },
        schema: [],
    },

    create: function (context) {
        // Check if the current file is in the ./src/apps directory
        const filePath = context.getFilename();
        const linuxFilePathRegex = /\/src\/application\/base\/crud\/.*\-table.service\.ts/;
        const windowsFilePathRegex = /\\src\\application\\base\\crud\\.*\-table.service\.ts/;
        if (!linuxFilePathRegex.test(filePath) && !windowsFilePathRegex.test(filePath) ) {
            return {};
        }

        return {
            ClassDeclaration(node) {
                const { id } = node;
                if (id.name.endsWith('TableService')) {
                    return;
                }

                context.report({
                    node: id,
                    message: `Class ${id.name}'s name should end with "TableService"`,
                });
            },
        };
    },
}