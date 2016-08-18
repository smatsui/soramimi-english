# soramimi-english (空耳英語変換アプリ)
このアプリは日本語のテキストを、空耳英語のテキストに変換します。空耳英語とは、例えば日本語の「掘った芋いじるな」が英語の「What time is it now?」に聞こえる、のように英語のように聞こえる日本語のことです。このアプリの仕組みは下の図のように、日本語のテキストをWatson Text to Speechを用いて日本語の音声ファイルに変換し、Watson Speech to Textを用いて日本語の音声ファイルを英語として解釈させ、英語のテキストに変換します。さて、Watsonは「掘った芋いじるな」を「What time is it now?」と解釈してくれるのでしょうか？
![Overview of the application architecture](overview.png)

Getting Started
================================================
###Deploy to Bluemixボタンを使ってBluemixでアプリを動かす方法
1. Bluemixアカウントを作成します。
2. [![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/smatsui/soramimi-english.git)　このボタンをクリックして、Bluemixにアプリを展開します。

###GithubからコードをクローンしてBluemixでアプリを動かす方法
1. Bluemixアカウントを作成します。
2. [cfコマンドラインインターフェース](https://github.com/cloudfoundry/cli)をPCにインストールします。
3.  コードをGithubからPCにクローンします
   ```sh
   $ git clone https://github.com/smatsui/soramimi-english.git
   ```
   
4. `manifest.yml`を編集し、アプリの名前を書き換えます。このアプリ名がURLとなるため、ユニークな名前である必要があります。
  ```none
  declared-services:
    text-to-speech-service:
      label: text_to_speech
      plan: standard
    speech-to-text-service:
      label: speech_to_text
      plan: standard
  applications:
    - services:
      - text-to-speech-service
      - speech-to-text-service
    name: <ここを書き換える>
    command: node ./bin/www
    path: .
  ```
  
5. Bluemixにログインします。
   ```sh
   $ cf api https://api.ng.bluemix.net
   $ cf login -u <Bluemixのユーザ名>
   ```
   
6. Watson Text to Speechサービスを作成します。
   ```sh
   $ cf create-service text_to_speech standard text-to-speech-service
   ```
   
6. Watson Speech to Textサービスを作成します。
   ```sh
   $ cf create-service speech_to_text standard speech-to-text-service
   ```
   
7. `$ git clone`を実行して落としてきたコード一式のルートディレクトリに移動し、アプリをBluemixに展開します。
   ```sh
   $ cf push
   ```

###PC上でアプリを動かす方法
1. Bluemixアカウントを作成します。
2. [Bluemixのカタログ](https://console.ng.bluemix.net/catalog/)からText to Speech ServiceとSpeech to Text Serviceを作成します。
3. Bluemixのダッシュボードに移動し、作成したサービスをクリック &rarr; Service Credentials &rarr; ADD CREDENTIALSから、それぞれのサービスのusernameとpasswordをコピーします。
4. コードをPCに落とします。  
   ```sh
   $ git clone https://github.com/smatsui/soramimi-english.git
   ```
   
5. Text to Speech Serviceのusernameとpasswordを、routes/index.jsのttsCredsに、Speech to Text ServiceのusernameとpasswordをsttCredsに貼り付けます。
   ```
   // Text to speech service credentials
   var ttsCreds = extend({
     version: 'v1',
     username: '<username>',
     password: '<password>'
   }, appEnv.getServiceCreds('text-to-speech-service'));
   ```
   ```
   // Speech to text service credentials
   var sttCreds = extend({
     version: 'v1',
     username: '<username>',
     password: '<password>'
   }, appEnv.getServiceCreds('speech-to-text-service'));
   ```
6. [Node.js](http://nodejs.org/)をインストールします。
7. コードのルートディレクトリに移動し、必要なパッケージをインストールします。
   ```sh
   cd soramimi-english
   npm install
   ```

8. アプリを起動します。
   ```sh
   $ node bin/www
   ```

9. ブラウザで[http://localhost:3000](http://localhost:3000)を開きます。

License
================================================
これらのコードは[Apache 2.0ライセンス](LICENSE)に準拠します。
