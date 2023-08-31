let observer = new MutationObserver(mutations => {
    for(let mutation of mutations) {
        for(let addedNode of mutation.addedNodes) {
            // console.log(addedNode.nodeName);

            if (addedNode.nodeName === "ARTICLE") {
                console.log( "YOOO0000");
            }
        }
    }
});
observer.observe(document, { childList: true, subtree: true });
console.log("LOAD");

setInterval(async () => {
    document.querySelectorAll(`article[data-testid="tweet"`).forEach((node) =>{
        const actionsNode = node.querySelector(`div[data-testid="reply"]`).parentNode.parentNode;
        const tweetNode = [...node.querySelectorAll(`div[data-testid="User-Name"] a`).values()][2];
        
        console.log(tweetNode);

        const existingNode = node.querySelector('a[x-mmntm="1"]');

        console.log(existingNode);

        if (existingNode) {
            return;
        }
        
        const tweetUrl = tweetNode?.getAttribute("href");

        const repostMmntmNode = document.createElement('a');
        repostMmntmNode.innerText = "REP";
        repostMmntmNode.setAttribute("x-mmntm", "1");
        repostMmntmNode.addEventListener('click', async () => {
            await chrome.runtime.sendMessage({
                cmdName: "repost",
                url: "https://twitter.com" + tweetUrl
            });
        })

        actionsNode.appendChild(repostMmntmNode);
    });
}, 2000);


const selectors = {
  tweet: '[data-testid="tweet"]',
  username: '[data-testid="User-Name"]'
}

