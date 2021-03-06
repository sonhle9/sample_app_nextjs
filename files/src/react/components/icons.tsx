import * as React from 'react';

type IconType = (props: React.ComponentPropsWithoutRef<'svg'>) => React.ReactElement;

export const LoyaltyAffiliateIcon: IconType = (props) => (
  <svg {...props} width="24" height="24" fill="none" viewBox="0 0 22 22">
    <path d="M17 17.667h-2c-.276 0-.5-.224-.5-.5v-.971c0-.271-.161-.495-.297-.634-.565-.583-.806-1.38-.662-2.185.18-1.002 1.006-1.826 2.007-2.003.739-.133 1.49.067 2.058.544.569.477.894 1.175.894 1.916 0 .668-.263 1.295-.741 1.767-.118.116-.259.304-.259.538v1.028c0 .276-.224.5-.5.5z" />
    <path d="M19.5 20h-7c-.276 0-.5-.224-.5-.5v-1.245c0-.587.44-1.084 1.022-1.157l2.083-.26 1.728-.005 2.145.264c.583.073 1.022.571 1.022 1.158V19.5c0 .276-.224.5-.5.5zM13.5 4H5.833C4.82 4 4 4.82 4 5.833V15.5c0 1.013.82 1.833 1.833 1.833h5.014c.313-.78 1.013-1.373 1.873-1.526-.107-.18-.2-.367-.273-.56-.08.053-.18.086-.28.086h-5c-.274 0-.5-.226-.5-.5 0-.273.226-.5.5-.5h5c.013 0 .02 0 .033.007-.053-.393-.047-.793.027-1.2.033-.173.08-.347.133-.513-.06.026-.127.04-.193.04h-5c-.274 0-.5-.227-.5-.5 0-.274.226-.5.5-.5h5c.22 0 .406.14.466.34.554-1 1.54-1.747 2.68-1.947h.02V5.833C15.333 4.82 14.513 4 13.5 4zm-1.333 6h-5c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h5c.276 0 .5.224.5.5s-.224.5-.5.5zm0-2.667h-5c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h5c.276 0 .5.224.5.5s-.224.5-.5.5z" />
  </svg>
);

export const LoyaltyIcon: IconType = (props) => (
  <svg {...props} width="24" height="24" fill="none" viewBox="0 0 24 24">
    <path d="M12.9 9.76l.998-.95-1.39-.197c-.161-.023-.301-.123-.374-.269L11.5 7.092l-.633 1.252c-.073.146-.213.246-.375.269l-1.39.197.998.95c.12.115.176.283.147.446l-.238 1.356 1.263-.648c.143-.073.312-.073.455 0l1.263.648-.238-1.356c-.029-.163.027-.331.147-.447z" />
    <path d="M11.5 3C7.93 3 5.024 5.904 5.024 9.474c0 3.57 2.904 6.475 6.474 6.475 3.57 0 6.475-2.905 6.475-6.475S15.069 3 11.499 3zm3.829 5.822l-1.55 1.475.366 2.08c.07.403-.354.718-.719.528l-1.927-.989-1.927.99c-.364.187-.79-.123-.718-.53l.365-2.08-1.55-1.474c-.3-.287-.136-.796.274-.854l2.152-.305.96-1.9c.169-.335.72-.335.889 0l.96 1.9 2.152.305c.41.058.574.567.273.854zM11.5 16.944c-1.26 0-2.445-.316-3.487-.868v3.425c0 .398.446.634.774.414l2.712-1.807 2.712 1.807c.33.22.774-.016.774-.414v-3.425c-1.041.552-2.227.868-3.486.868z" />
  </svg>
);

export const AccountsIcon: IconType = (props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props}>
      <defs>
        <path id="prefix__a" d="M0 0h24v24H0z"></path>
      </defs>
      <g fill="none" fillRule="evenodd" opacity="0.5">
        <mask id="prefix__b" fill="#fff">
          <use xlinkHref="#prefix__a"></use>
        </mask>
        <g fill="#FFF" fillRule="nonzero" mask="url(#prefix__b)">
          <path d="M17 17.667h-2a.5.5 0 01-.5-.5v-.971c0-.271-.161-.495-.297-.634a2.478 2.478 0 01-.662-2.185 2.52 2.52 0 012.007-2.003 2.503 2.503 0 012.952 2.46c0 .668-.263 1.295-.741 1.767-.118.116-.259.304-.259.538v1.028a.5.5 0 01-.5.5z"></path>
          <path d="M19.5 20h-7a.5.5 0 01-.5-.5v-1.245c0-.587.44-1.084 1.022-1.157l2.083-.26 1.728-.005 2.145.264A1.169 1.169 0 0120 18.255V19.5a.5.5 0 01-.5.5zm-6-16H5.833C4.82 4 4 4.82 4 5.833V15.5c0 1.013.82 1.833 1.833 1.833h5.014a2.495 2.495 0 011.873-1.526c-.107-.18-.2-.367-.273-.56a.516.516 0 01-.28.086h-5a.503.503 0 01-.5-.5c0-.273.226-.5.5-.5h5c.013 0 .02 0 .033.007a3.815 3.815 0 01.027-1.2c.033-.173.08-.347.133-.513a.49.49 0 01-.193.04h-5a.503.503 0 01-.5-.5c0-.274.226-.5.5-.5h5c.22 0 .406.14.466.34.554-1 1.54-1.747 2.68-1.947h.02V5.833C15.333 4.82 14.513 4 13.5 4zm-1.333 6h-5a.5.5 0 010-1h5a.5.5 0 010 1zm0-2.667h-5a.5.5 0 010-1h5a.5.5 0 010 1z"></path>
        </g>
      </g>
    </svg>
  );
};

export const RewardsIcon: IconType = (props) => {
  return (
    <svg {...props} width="40" height="40" viewBox="0 0 40 40">
      <defs>
        <filter id="kg3b44gp4a">
          <feColorMatrix
            in="SourceGraphic"
            values="0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 1.000000 0"
          />
        </filter>
        <path
          id="e5i5f4j20b"
          d="M8.333 35.833c-2.531 0-4.583-2.052-4.583-4.583V22.5h-.417c-.632 0-1.155-.47-1.238-1.08l-.012-.17v-8c0-1.666 1.134-3.107 2.682-3.24L5 10h1.667c.69 0 1.25.56 1.25 1.25 0 .633-.47 1.156-1.08 1.239l-.17.011H5c-.153 0-.357.222-.406.586l-.01.164V20h30.833v-6.75c0-.402-.186-.675-.349-.737L35 12.5h-1.667c-.69 0-1.25-.56-1.25-1.25 0-.633.47-1.156 1.08-1.239l.17-.011H35c1.587 0 2.797 1.36 2.908 3.002l.009.248v8c0 .633-.47 1.156-1.08 1.239l-.17.011h-.418l.001 8.75c0 2.459-1.936 4.466-4.368 4.578l-.215.005zM18.75 22.5L6.25 22.5v8.75c0 1.079.82 1.966 1.87 2.073l.213.01H18.75V22.498zm15.001.001h-12.5v10.832l10.417.001c1.1 0 2.001-.853 2.078-1.934l.005-.149V22.5zM26.429 3.333c2.644 0 4.821 2.032 4.821 4.584 0 2.551-2.177 4.583-4.821 4.583h-3.617l1.938 2.583c.414.553.302 1.336-.25 1.75-.502.377-1.195.319-1.628-.11l-.122-.14-2.752-3.666-2.748 3.666c-.377.502-1.058.64-1.594.35l-.156-.1c-.502-.376-.64-1.058-.35-1.594l.1-.156 1.936-2.584-3.615.001c-2.57 0-4.7-1.92-4.816-4.372l-.005-.211c0-2.552 2.177-4.584 4.821-4.584 2.7 0 4.736 1.52 6.167 3.95.091.154.179.311.263.47l.031-.062.23-.409c1.431-2.428 3.468-3.949 6.167-3.949zm-12.858 2.5c-1.3 0-2.321.953-2.321 2.084 0 1.13 1.02 2.083 2.321 2.083h4.716l-.184-.44c-.078-.173-.16-.344-.246-.512l-.273-.497c-1.025-1.738-2.337-2.718-4.013-2.718zm12.858 0c-1.676 0-2.988.98-4.013 2.718-.191.325-.364.663-.519 1.008l-.185.441h4.717c1.219 0 2.192-.837 2.31-1.874l.011-.21c0-1.13-1.02-2.083-2.321-2.083z"
        />
      </defs>
      <g fill="none" fill-rule="evenodd">
        <g>
          <g filter="url(#kg3b44gp4a)" transform="translate(-490 -189) translate(360 149)">
            <g transform="translate(130 40)">
              <path d="M0 0H40V40H0z" />
              <mask id="vg47a38utc" fill="#fff">
                <use xlinkHref="#e5i5f4j20b" />
              </mask>
              <use fill="#98A6BA" fill-rule="nonzero" xlinkHref="#e5i5f4j20b" />
              <g fill="#788494" mask="url(#vg47a38utc)">
                <path d="M0 0H40V40H0z" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export const MembershipIcon: IconType = (props) => {
  return (
    <svg {...props} width="40" height="40" viewBox="0 0 40 40">
      <defs>
        <filter id="4lkea9u9ga">
          <feColorMatrix
            in="SourceGraphic"
            values="0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 1.000000 0"
          />
        </filter>
        <path
          id="rl9qihs7gb"
          d="M20 2.083c5.183 0 10.355 1.388 15.5 4.15 1.489.799 2.417 2.35 2.417 4.039l-.002 8.227c-.001.108-.004.211-.009.298l-.019.2c.02.325.03.66.03 1.003 0 9.895-8.022 17.917-17.917 17.917-9.895 0-17.917-8.022-17.917-17.917l.001-.202c.002-.133.005-.26.01-.369l.019-.268c-.02-.275-.03-.551-.03-.828v-8.061c0-1.689.929-3.24 2.416-4.039C9.645 3.471 14.817 2.083 20 2.083zm0 2.5c-4.756 0-9.525 1.28-14.319 3.853-.676.363-1.098 1.068-1.098 1.836l.001 8.192.024.68c-.017.278-.025.563-.025.856 0 8.514 6.903 15.417 15.417 15.417S35.417 28.514 35.417 20l-.001-.177-.023-.841c.016-.215.024-.431.024-.649v-8.061c0-.768-.422-1.473-1.098-1.836C29.525 5.863 24.756 4.583 20 4.583zM18.846 9.52c.427-1.027 1.881-1.027 2.308 0l2.351 5.655 6.105.489c1.047.084 1.506 1.322.843 2.069l-.13.126-4.651 3.983 1.422 5.958c.244 1.025-.799 1.846-1.716 1.437l-.152-.08-5.228-3.192-5.224 3.192c-.9.549-2.003-.19-1.897-1.188l.03-.169 1.42-5.958-4.65-3.983c-.798-.683-.442-1.955.534-2.169l.179-.026 6.103-.489zM20 13.255l-1.49 3.584c-.18.433-.588.729-1.055.766l-3.87.31 2.948 2.526c.312.267.47.667.432 1.068l-.029.172-.903 3.776 3.315-2.024c.343-.21.762-.24 1.126-.09l.178.09 3.313 2.024-.901-3.776c-.095-.4.012-.816.279-1.118l.124-.122 2.946-2.526-3.868-.31c-.409-.032-.771-.263-.976-.61l-.078-.156L20 13.255z"
        />
      </defs>
      <g fill="none" fill-rule="evenodd">
        <g>
          <g filter="url(#4lkea9u9ga)" transform="translate(-810 -189) translate(680 149)">
            <g transform="translate(130 40)">
              <path d="M0 0H40V40H0z" />
              <mask id="sv3mprromc" fill="#fff">
                <use xlinkHref="#rl9qihs7gb" />
              </mask>
              <use fill="#788494" fill-rule="nonzero" xlinkHref="#rl9qihs7gb" />
              <g fill="#788494" mask="url(#sv3mprromc)">
                <path d="M0 0H40V40H0z" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export const VehicleIcon: IconType = (props) => {
  return (
    <svg {...props} width="40" height="40" viewBox="0 0 40 40">
      <defs>
        <filter id="bkrqmjee9a">
          <feColorMatrix
            in="SourceGraphic"
            values="0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 1.000000 0"
          />
        </filter>
        <path
          id="214wtv31jb"
          d="M29.187 3.75c2.024 0 3.808 1.328 4.39 3.266l4.287 14.291.053.36v10c0 2.531-2.052 4.583-4.584 4.583h-1.666c-2.532 0-4.584-2.052-4.584-4.583v-.417H12.917v.417c0 2.437-1.903 4.43-4.304 4.575l-.28.008H6.667c-2.532 0-4.584-2.052-4.584-4.583v-10l.053-.36 4.287-14.29c.582-1.94 2.366-3.267 4.39-3.267zm0 2.5H10.813c-.92 0-1.73.603-1.995 1.485L4.583 21.847v9.82c0 1.078.82 1.966 1.87 2.072l.214.011h1.666c1.15 0 2.084-.933 2.084-2.083V30c0-.69.56-1.25 1.25-1.25h16.666c.69 0 1.25.56 1.25 1.25v1.667c0 1.15.933 2.083 2.084 2.083h1.666c1.15 0 2.084-.933 2.084-2.083v-9.814L31.182 7.735c-.244-.814-.954-1.39-1.785-1.474l-.21-.011zM13.333 19.583c.69 0 1.25.56 1.25 1.25 0 .633-.47 1.156-1.08 1.239l-.17.011h-5c-.69 0-1.25-.56-1.25-1.25 0-.632.47-1.155 1.08-1.238l.17-.012h5zm18.334 0c.69 0 1.25.56 1.25 1.25 0 .633-.47 1.156-1.08 1.239l-.17.011h-5c-.69 0-1.25-.56-1.25-1.25 0-.632.47-1.155 1.08-1.238l.17-.012h5z"
        />
      </defs>
      <g fill="none" fill-rule="evenodd">
        <g>
          <g filter="url(#bkrqmjee9a)" transform="translate(-1130 -189) translate(1000 149)">
            <g transform="translate(130 40)">
              <path d="M0 0H40V40H0z" />
              <mask id="ggdj4hoy0c" fill="#fff">
                <use xlinkHref="#214wtv31jb" />
              </mask>
              <use fill="#788494" fill-rule="nonzero" xlinkHref="#214wtv31jb" />
              <g fill="#788494" mask="url(#ggdj4hoy0c)">
                <path d="M0 0H40V40H0z" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};

export const BankIcon: IconType = (props) => {
  return (
    <svg {...props} width="40" height="40" viewBox="0 0 40 40">
      <defs>
        <filter id="o32xf6zvva">
          <feColorMatrix
            in="SourceGraphic"
            values="0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 0 1.000000 0 0 0 1.000000 0"
          />
        </filter>
        <path
          id="zfvplvv13b"
          d="M19.329 3.112c.41-.26.933-.26 1.342 0l15.92 10.13c.97.618 1.256 1.906.638 2.876-.382.601-1.045.965-1.757.965h-.889l.001 11.948c.936.445 1.598 1.375 1.661 2.464l.005.172v1.666c0 1.611-1.306 2.917-2.917 2.917H6.667c-1.611 0-2.917-1.306-2.917-2.917v-1.666c0-1.164.681-2.168 1.666-2.636V17.083h-.888c-1.1 0-2.001-.853-2.078-1.934L2.445 15c0-.712.364-1.375.965-1.758zM33.333 31.25H6.667c-.23 0-.417.187-.417.417v1.666c0 .23.187.417.417.417h26.666c.23 0 .417-.187.417-.417v-1.666c0-.23-.187-.417-.417-.417zm-21.25-14.167H7.916V28.75h4.167V17.083zm6.666 0h-4.166V28.75h4.166V17.083zm6.667 0h-4.167V28.75h4.167V17.083zm6.667 0h-4.167V28.75h4.167V17.083zM20 5.647L5.957 14.583h28.085L20 5.647z"
        />
      </defs>
      <g fill="none" fill-rule="evenodd">
        <g>
          <g filter="url(#o32xf6zvva)" transform="translate(-490 -653) translate(360 613)">
            <g transform="translate(130 40)">
              <path d="M0 0H40V40H0z" />
              <mask id="ucivh2kinc" fill="#fff">
                <use xlinkHref="#zfvplvv13b" />
              </mask>
              <use fill="#000" fill-rule="nonzero" xlinkHref="#zfvplvv13b" />
              <g fill="#788494" mask="url(#ucivh2kinc)">
                <path d="M0 0H40V40H0z" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
};
