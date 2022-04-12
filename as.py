import asyncio


async def req(t):
    await asyncio.sleep(t)
    print('in', t)
    return t

async def par(actions):
    res = await asyncio.gather(*actions)
    return res

actions = [req(t) for t in (1, 3, 2)]
res = asyncio.run(par(actions))
print(res)
