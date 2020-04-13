/**
 * 区块链函数
 */
define(['module.functions', 'axios'], function (functions, request) {

    /**
     * 获取所有区块
     * @returns {Promise<*>}
     */
    let getAllBlocks = async () => {
        let response = await request.get('/api/block/')
            .catch((e) => {
                console.error("获取区块链数据失败：", e);
                functions.modal("错误", "无法获取区块链数据，请检查网络连接！");
            });
        return response.data.data;
    };

    /**
     * 处理区块数据
     * @param blocks
     * @returns {*}
     */
    let processData = (blocks) => {
        for (const block of blocks) {
            block.readableTime = functions.dateFormatTs(block.timestamp, 'Y-m-d H:i:s');
        }
        return blocks;
    };

    /**
     * 增加区块
     * @param blockData
     * @returns {Promise<null|*>}
     */
    let addBlock = async (blockData) => {
        let response = await request.post('/api/block/', JSON.stringify({data: blockData}))
            .catch((e) => {
                console.error("增加区块失败：", blockData, e);
                functions.modal("错误", "增加区块失败！请检查网络连接。");
            });
        let data = response.data;
        if (data.status !== 'OK') {
            console.error("增加区块错误：", blockData, data);
            functions.modal("错误", data.message);
            return null;
        }
        return data.data.blockId;
    };

    /**
     * 从文件导入
     * @param filepath
     * @returns {Promise<null|*>}
     */
    let importBlock = async (filepath) => {
        let response = await request.post('/api/block/file/', JSON.stringify({filepath: filepath}))
            .catch((e) => {
                console.error("增加区块失败：", filepath, e);
                functions.modal("错误", "增加区块失败！请检查网络连接。");
            });
        let data = response.data;
        if (data.status !== 'OK') {
            console.error("增加区块错误：", filepath, data);
            functions.modal("错误", data.message);
            return null;
        }
        return data.data.blockIds;
    };

    return {
        getAllBlocks: getAllBlocks,
        processData: processData,
        addBlock: addBlock,
        importBlock: importBlock
    };
});