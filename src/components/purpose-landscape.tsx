export function PurposeLandscape() {
  return (
    <div className="landscape-wrap">
      <svg className="landscape" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" role="img" aria-label="A golden sun rising over soft green hills and delicate wildflowers">
        <circle className="sun-halo" cx="720" cy="143" r="115" />
        <circle className="sun" cx="720" cy="143" r="79" />
        <path className="far" d="M0 157C164 153 242 214 413 171S656 117 815 177 1137 90 1440 145V300H0Z" />
        <path className="mid" d="M0 221C210 134 276 172 456 223S757 224 915 169 1179 171 1440 219V300H0Z" />
        <path className="near" d="M0 231C216 217 279 185 479 235S813 283 1037 218 1250 185 1440 224V300H0Z" />
        <path className="front" d="M0 261C255 221 396 271 672 278S1108 233 1440 268V300H0Z" />
        <path className="contour" d="M0 247C204 206 324 224 502 259M964 235C1124 202 1281 217 1440 242M50 266C216 247 364 251 470 278" />
        <g className="botanical">
          <path d="M123 265Q131 200 115 135M127 229Q87 223 81 195Q115 193 127 229ZM127 209Q156 196 160 170Q130 173 127 209ZM123 186Q97 170 99 149Q124 158 123 186ZM117 156Q135 140 133 122Q115 128 117 156Z" />
          <path d="M185 260Q190 225 208 191M198 220Q174 217 168 201Q190 199 198 220ZM203 208Q226 207 234 189Q212 187 203 208Z" />
          <path d="M1317 259Q1303 203 1319 148M1309 231Q1279 216 1274 195Q1301 199 1309 231ZM1308 213Q1336 207 1345 182Q1314 186 1308 213ZM1312 184Q1290 169 1292 152Q1315 159 1312 184ZM1318 161Q1337 149 1337 133Q1319 140 1318 161Z" />
          <path d="M1260 263Q1254 231 1237 214M1252 238Q1274 232 1279 214Q1257 218 1252 238Z" />
        </g>
        <g className="spark"><path d="M533 90v12m-6-6h12M908 76v16m-8-8h16M974 133v8m-4-4h8" /><path d="M344 121q9-9 18 0m-18 0q9 9 18 0" /></g>
      </svg>
      <p className="landscape-caption">Small steps. Deeper roots.</p>
    </div>
  );
}
