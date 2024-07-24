// サンプルデータ
const sampleData = {
    points: 12000,
    ranking: [
        { name: "おとうと", points: 8000 },
        { name: "お兄さん", points: 7000 },
        { name: "いもうと", points: 12000 },
        { name: "お父さん", points: 5000 }
    ]
};

// トロフィー画像のパス
const trophyImages = [
    "/frontend/images/Trophy_1_gold.png","/frontend/images/Trophy_2_silver.png","/frontend/images/Trophy_3_bronze.png","/frontend/images/Trophy_4.png"
]

// データをポイントの多い順にソート
sampleData.ranking.sort((a, b) => b.points - a.points);

// ポイントを表示
document.getElementById('points-span').textContent = sampleData.points.toLocaleString();

// ランキングを表示
const rankingContainer = document.getElementById('ranking');
sampleData.ranking.forEach((item, index) => {
    const rankingItem = document.createElement('div');
    rankingItem.className = 'flex justify-between items-center bg-white h-36 mb-14 rounded-3xl';
    rankingItem.innerHTML = `
        <div class="flex items-center">
            <img src="${trophyImages[index]}" alt="trophy" class="w-16 h-16 ml-4">
            <span class="text-6xl ml-6">${item.name}</span>
        </div>
        <span class="text-4xl mr-4">${item.points.toLocaleString()}pt</span>
    `;
    rankingContainer.appendChild(rankingItem);
});