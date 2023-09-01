setInterval(async () => {
    document.querySelectorAll(`article[data-testid="tweet"`).forEach((node) =>{
        const existingNode = node.querySelector('a.mmntm');

        if (existingNode) return;

        const tweetUrl = node.querySelector('time')?.parentNode?.getAttribute("href");

        if (!tweetUrl) return;

        const repostMmntmNode = document.createElement('a');
        repostMmntmNode.setAttribute("class", "mmntm");
        repostMmntmNode.addEventListener('click', async () => {
            await chrome.runtime.sendMessage({
                cmdName: "repost",
                url: "https://twitter.com" + tweetUrl
            });
        })

        const actionsNode = node.querySelector(`div[data-testid="reply"]`).parentNode.parentNode;
        actionsNode.appendChild(repostMmntmNode);
    });
}, 2000);
