const clearDirectory = async (directory) => {
    try {
        const files = await fs.promises.readdir(directory);
        const unlinkPromises = files.map(filename => fs.promises.unlink(path.join(directory, filename)));
        await Promise.all(unlinkPromises);
        console.log('All files deleted successfully.');
    } catch (err) {
        console.error('Error clearing directory:', err);
    }
};

module.exports = clearDirectory;