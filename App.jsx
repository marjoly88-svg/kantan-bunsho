import React, { useState, useRef, useEffect } from 'react';

const App = () => {
  const [screen, setScreen] = useState('home');
  const [template, setTemplate] = useState('memo');
  const [savedDocs, setSavedDocs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toLocaleDateString('ja-JP'),
    to: '',
    from: '',
    body: '',
    greeting: '拝啓',
    closing: '敬具',
    season: '時下ますますご清栄のこととお慶び申し上げます。',
  });
  const previewRef = useRef(null);

  // 保存履歴を読み込み
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedDocuments');
      if (saved) {
        setSavedDocs(JSON.parse(saved));
      }
    } catch (e) {
      console.error('履歴読み込みエラー:', e);
    }
  }, []);

  // 文書を保存
  const saveDocument = () => {
    const templateNames = {
      free: '自由',
      memo: 'メモ',
      letter: '手紙',
      notice: 'お知らせ',
    };
    const doc = {
      id: Date.now(),
      template,
      name: formData.title || formData.to || templateNames[template],
      savedAt: new Date().toLocaleDateString('ja-JP'),
      data: formData,
    };
    const newDocs = [doc, ...savedDocs].slice(0, 20); // 最大20件
    setSavedDocs(newDocs);
    try {
      localStorage.setItem('savedDocuments', JSON.stringify(newDocs));
    } catch (e) {
      console.error('保存エラー:', e);
    }
    alert('保存しました');
  };

  // 文書を開く
  const openDocument = (doc) => {
    setTemplate(doc.template);
    setFormData(doc.data);
    setScreen('edit');
  };

  // 文書を削除
  const deleteDocument = (id) => {
    const newDocs = savedDocs.filter(d => d.id !== id);
    setSavedDocs(newDocs);
    try {
      localStorage.setItem('savedDocuments', JSON.stringify(newDocs));
    } catch (e) {
      console.error('削除エラー:', e);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveImage = async () => {
    if (!previewRef.current) return;
    
    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
      });
      
      const link = document.createElement('a');
      link.download = `メモ_${formData.date}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('保存エラー:', error);
    }
  };

  const fontStyle = { fontFamily: '"Noto Serif JP", serif' };

  // ホーム画面
  if (screen === 'home') {
    return (
      <div className="min-h-dvh bg-stone-50 p-6" style={fontStyle}>
        <div className="max-w-md mx-auto pt-8">
          <h1 className="text-2xl font-semibold text-stone-800 text-center text-balance mb-2">
            かんたん文書作成
          </h1>
          <p className="text-stone-500 text-center text-pretty mb-2">
            テンプレートを選んで、文字を入れて、保存するだけ
          </p>
          <p className="text-stone-400 text-center text-sm text-pretty mb-12">
            保存した画像はコンビニや自宅で印刷できます<br />
            ※コンビニでは各コンビニの印刷アプリを使ってください
          </p>

          <div className="space-y-3">
            <button
              onClick={() => { setTemplate('free'); setScreen('edit'); }}
              className="w-full bg-white border border-stone-200 rounded-lg p-5 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 bg-stone-100 rounded-md flex items-center justify-center text-stone-600 text-sm font-medium">
                  自由
                </div>
                <div>
                  <h2 className="text-base font-medium text-stone-800">自由に書く</h2>
                  <p className="text-sm text-stone-500">好きなように書き込める白紙</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => { setTemplate('memo'); setScreen('edit'); }}
              className="w-full bg-white border border-stone-200 rounded-lg p-5 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 bg-stone-100 rounded-md flex items-center justify-center text-stone-600 text-sm font-medium">
                  メモ
                </div>
                <div>
                  <h2 className="text-base font-medium text-stone-800">メモ・連絡事項</h2>
                  <p className="text-sm text-stone-500">誰から誰へ、用件を伝える</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => { setTemplate('letter'); setScreen('edit'); }}
              className="w-full bg-white border border-stone-200 rounded-lg p-5 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 bg-stone-100 rounded-md flex items-center justify-center text-stone-600 text-sm font-medium">
                  手紙
                </div>
                <div>
                  <h2 className="text-base font-medium text-stone-800">お手紙</h2>
                  <p className="text-sm text-stone-500">拝啓〜敬具の正式な手紙</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => { setTemplate('notice'); setScreen('edit'); }}
              className="w-full bg-white border border-stone-200 rounded-lg p-5 text-left"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 bg-stone-100 rounded-md flex items-center justify-center text-stone-600 text-sm font-medium">
                  知
                </div>
                <div>
                  <h2 className="text-base font-medium text-stone-800">お知らせ</h2>
                  <p className="text-sm text-stone-500">回覧板や案内文</p>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-stone-200">
            <h2 className="text-base font-medium text-stone-800 mb-4">保存した文書</h2>
            
            {savedDocs.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-6">
                まだ保存した文書はありません
              </p>
            ) : (
              <div className="space-y-2">
                {savedDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white border border-stone-200 rounded-lg p-4 flex items-center justify-between"
                  >
                    <button
                      onClick={() => openDocument(doc)}
                      className="flex-1 text-left"
                    >
                      <p className="text-stone-800 font-medium">{doc.name}</p>
                      <p className="text-sm text-stone-400">{doc.savedAt}</p>
                    </button>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="text-stone-400 text-sm px-3 py-1"
                      aria-label="削除"
                    >
                      削除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 編集画面
  if (screen === 'edit') {
    const templateNames = {
      free: '自由に書く',
      memo: 'メモ・連絡事項',
      letter: 'お手紙',
      notice: 'お知らせ',
    };

    return (
      <div className="min-h-dvh bg-stone-50 p-6" style={fontStyle}>
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setScreen('home')}
            className="text-stone-500 text-sm mb-6"
          >
            ← もどる
          </button>

          <h1 className="text-xl font-semibold text-stone-800 mb-8">{templateNames[template]}</h1>

          <div className="space-y-5">
            {/* 自由以外：日付 */}
            {template !== 'free' && (
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  日付
                </label>
                <input
                  type="text"
                  value={formData.date}
                  onChange={(e) => handleChange('date', e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400"
                />
              </div>
            )}

            {/* 自由以外：宛先 */}
            {template !== 'free' && (
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  宛先
                </label>
                <input
                  type="text"
                  value={formData.to}
                  onChange={(e) => handleChange('to', e.target.value)}
                  placeholder="例：田中さん"
                  className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400"
                />
              </div>
            )}

            {/* メモ・お知らせ：タイトル */}
            {(template === 'memo' || template === 'notice') && (
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  タイトル
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder={template === 'memo' ? '例：会議の件' : '例：夏祭り開催のお知らせ'}
                  className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400"
                />
              </div>
            )}

            {/* お手紙：頭語・時候の挨拶 */}
            {template === 'letter' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-2">
                    頭語
                  </label>
                  <select
                    value={formData.greeting}
                    onChange={(e) => handleChange('greeting', e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400"
                  >
                    <option value="拝啓">拝啓（一般的）</option>
                    <option value="謹啓">謹啓（丁寧）</option>
                    <option value="前略">前略（挨拶省略）</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-600 mb-2">
                    時候の挨拶
                  </label>
                  <input
                    type="text"
                    value={formData.season}
                    onChange={(e) => handleChange('season', e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400"
                  />
                </div>
              </>
            )}

            {/* 共通：内容 */}
            <div>
              <label className="block text-sm font-medium text-stone-600 mb-2">
                {template === 'free' ? '書きたいこと' : '内容'}
              </label>
              <textarea
                value={formData.body}
                onChange={(e) => handleChange('body', e.target.value)}
                placeholder={template === 'free' ? '自由に書いてください' : '伝えたいことを書いてください'}
                rows={template === 'free' ? 10 : 5}
                className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400 resize-none"
              />
            </div>

            {/* お手紙：結語 */}
            {template === 'letter' && (
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  結語
                </label>
                <select
                  value={formData.closing}
                  onChange={(e) => handleChange('closing', e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-stone-800 focus:outline-none focus:border-stone-400"
                >
                  <option value="敬具">敬具（拝啓に対応）</option>
                  <option value="謹白">謹白（謹啓に対応）</option>
                  <option value="草々">草々（前略に対応）</option>
                </select>
              </div>
            )}

            {/* 自由以外：差出人 */}
            {template !== 'free' && (
              <div>
                <label className="block text-sm font-medium text-stone-600 mb-2">
                  差出人
                </label>
                <input
                  type="text"
                  value={formData.from}
                  onChange={(e) => handleChange('from', e.target.value)}
                  placeholder="例：山田"
                  className="w-full bg-white border border-stone-200 rounded-lg px-4 py-3 text-stone-800 placeholder-stone-300 focus:outline-none focus:border-stone-400"
                />
              </div>
            )}
          </div>

          <button
            onClick={() => setScreen('preview')}
            className="w-full mt-8 bg-stone-800 text-white font-medium rounded-lg py-4"
          >
            プレビューを見る
          </button>
        </div>
      </div>
    );
  }

  // プレビュー画面
  if (screen === 'preview') {
    return (
      <div className="min-h-dvh bg-stone-50 p-6" style={fontStyle}>
        <div className="max-w-md mx-auto">
          <button
            onClick={() => setScreen('edit')}
            className="text-stone-500 text-sm mb-6"
          >
            ← 編集にもどる
          </button>

          <h1 className="text-xl font-semibold text-stone-800 mb-6">プレビュー</h1>

          <div
            ref={previewRef}
            className="bg-white border border-stone-200 rounded-lg p-8 mb-6"
            style={{ aspectRatio: '210 / 297' }}
          >
            <div className="h-full flex flex-col">
              {/* 自由以外：日付 */}
              {template !== 'free' && (
                <div className="text-right text-sm text-stone-500 mb-6">
                  {formData.date}
                </div>
              )}

              {/* 自由以外：宛先 */}
              {template !== 'free' && formData.to && (
                <div className="text-base text-stone-700 mb-4">
                  {formData.to} 様
                </div>
              )}

              {/* メモ・お知らせ：タイトル */}
              {(template === 'memo' || template === 'notice') && (
                <div className="text-center mb-6">
                  <h2 className="text-xl font-semibold text-stone-800 text-balance">
                    {formData.title || (template === 'memo' ? 'メモ' : 'お知らせ')}
                  </h2>
                </div>
              )}

              {/* お手紙：頭語＋時候の挨拶 */}
              {template === 'letter' && (
                <div className="mb-4">
                  <p className="text-stone-700">{formData.greeting}</p>
                  <p className="text-stone-700 mt-2 text-pretty">{formData.season}</p>
                </div>
              )}

              {/* 本文 */}
              <div className="flex-1 text-stone-700 text-pretty whitespace-pre-wrap leading-relaxed">
                {formData.body}
              </div>

              {/* お手紙：結語 */}
              {template === 'letter' && (
                <div className="text-right text-stone-700 mt-4">
                  {formData.closing}
                </div>
              )}

              {/* 自由以外：差出人 */}
              {template !== 'free' && formData.from && (
                <div className="text-right text-stone-700 mt-4">
                  {formData.from}
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleSaveImage}
            className="w-full bg-stone-800 text-white font-medium rounded-lg py-4"
          >
            写真フォルダに保存
          </button>

          <button
            onClick={saveDocument}
            className="w-full mt-3 bg-white border border-stone-200 text-stone-700 font-medium rounded-lg py-4"
          >
            あとで編集できるように保存
          </button>

          <p className="text-center text-sm text-stone-400 mt-4">
            写真フォルダの画像はコンビニプリントアプリで印刷できます
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default App;
